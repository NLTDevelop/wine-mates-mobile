import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Region } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import { eventsModel } from '@/entities/events/EventsModel';
import { eventsService } from '@/entities/events/EventsService';
import { useLocationPermission } from '@/hooks/useLocationPermission.ts';
import { IUserLocation } from '@/entities/location/types/IUserLocation';
import { IEventFilters } from '@/modules/event/types/IEventFilters';

const KYIV_COORDINATES = {
    latitude: 50.4501,
    longitude: 30.5234,
};

const MAP_DELTA = {
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
};

const DEFAULT_RADIUS_KM = 100;

interface IProps {
    searchLocation?: IUserLocation | null;
    filters?: IEventFilters;
}

export const useEventMap = ({ searchLocation, filters }: IProps = {}) => {
    const isFocused = useIsFocused();
    const { userLocation, isLoading: isLocationLoading } = useLocationPermission();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'all' | 'tastings' | 'parties'>('all');
    const hasAutoLoadedOnFocusRef = useRef(false);
    const lastLoadedLocationKeyRef = useRef('');
    const lastLoadedFiltersKeyRef = useRef('');

    const filtersKey = useMemo(() => {
        return `${filters?.radiusKm ?? ''}:${filters?.eventDate ?? ''}:${filters?.language ?? ''}:${filters?.sex ?? ''}:${filters?.minAge ?? ''}:${filters?.maxAge ?? ''}:${filters?.minPrice ?? ''}:${filters?.maxPrice ?? ''}`;
    }, [filters?.eventDate, filters?.language, filters?.maxAge, filters?.maxPrice, filters?.minAge, filters?.minPrice, filters?.radiusKm, filters?.sex]);

    const getTargetLocation = useCallback((location?: IUserLocation | null) => {
        return location || searchLocation || userLocation || KYIV_COORDINATES;
    }, [searchLocation, userLocation]);

    const loadEvents = useCallback(async (location?: IUserLocation | null) => {
        const targetLocation = getTargetLocation(location);

        setIsLoadingEvents(true);
        try {
            await eventsService.getMapPins({
                latitude: targetLocation.latitude,
                longitude: targetLocation.longitude,
                radiusKm: filters?.radiusKm ?? DEFAULT_RADIUS_KM,
                eventDate: filters?.eventDate,
                language: filters?.language,
                minPrice: filters?.minPrice,
                maxPrice: filters?.maxPrice,
                sex: filters?.sex,
                minAge: filters?.minAge,
                maxAge: filters?.maxAge,
            });
        } catch (error) {
            console.warn('useEventMap -> loadEvents: ', error);
        } finally {
            setIsLoadingEvents(false);
        }
    }, [filters?.eventDate, filters?.language, filters?.maxAge, filters?.maxPrice, filters?.minAge, filters?.minPrice, filters?.radiusKm, filters?.sex, getTargetLocation]);

    useEffect(() => {
        if (!isFocused) {
            hasAutoLoadedOnFocusRef.current = false;
            lastLoadedFiltersKeyRef.current = '';
            return;
        }

        if (isLocationLoading) {
            return;
        }

        const targetLocation = getTargetLocation();
        const currentLocationKey = `${targetLocation.latitude}:${targetLocation.longitude}`;
        const isSameLocation = lastLoadedLocationKeyRef.current === currentLocationKey;
        const isSameFilters = lastLoadedFiltersKeyRef.current === filtersKey;
        if (hasAutoLoadedOnFocusRef.current && isSameLocation && isSameFilters) {
            return;
        }

        hasAutoLoadedOnFocusRef.current = true;
        lastLoadedLocationKeyRef.current = currentLocationKey;
        lastLoadedFiltersKeyRef.current = filtersKey;
        loadEvents();
    }, [filtersKey, getTargetLocation, isFocused, isLocationLoading, loadEvents]);

    const initialRegion: Region = useMemo(() => {
        if (userLocation) {
            return {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                ...MAP_DELTA,
            };
        }
        return {
            ...KYIV_COORDINATES,
            ...MAP_DELTA,
        };
    }, [userLocation]);

    const onMarkerPress = useCallback((markerId: number) => {
        eventsModel.setSelectedEventId(markerId);
        setIsModalVisible(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const onFavoritePress = useCallback(async (eventId: number) => {
        try {
            await eventsService.toggleSave(eventId);
        } catch (error) {
            console.warn('useEventMap -> onFavoritePress: ', error);
        }
    }, []);

    const onTabChange = useCallback((tab: 'all' | 'tastings' | 'parties') => {
        setSelectedTab(tab);
    }, []);

    const mapPins = eventsModel.mapPins;

    const refetch = useCallback((location?: IUserLocation | null) => {
        const targetLocation = getTargetLocation(location);
        hasAutoLoadedOnFocusRef.current = true;
        lastLoadedLocationKeyRef.current = `${targetLocation.latitude}:${targetLocation.longitude}`;
        lastLoadedFiltersKeyRef.current = filtersKey;
        return loadEvents(targetLocation);
    }, [filtersKey, getTargetLocation, loadEvents]);

    return {
        mapPins,
        initialRegion,
        selectedMarkerId: eventsModel.selectedEventId,
        onMarkerPress,
        userLocation,
        isLocationLoading,
        isLoadingEvents,
        isModalVisible,
        onCloseModal,
        onFavoritePress,
        selectedTab,
        onTabChange,
        refetch,
    };
};
