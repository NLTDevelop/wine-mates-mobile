import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Region } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import { eventsModel } from '@/entities/events/EventsModel';
import { eventsService } from '@/entities/events/EventsService';
import { useLocationPermission } from '@/hooks/useLocationPermission.ts';
import { EventType } from '@/entities/events/enums/EventType';
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
    const lastLoadedEventTypeRef = useRef<EventType | undefined>(undefined);
    const lastLoadedLocationKeyRef = useRef('');
    const lastLoadedFiltersKeyRef = useRef('');

    const filtersKey = useMemo(() => {
        return `${filters?.radiusKm ?? ''}:${filters?.eventDate ?? ''}:${filters?.sex ?? ''}`;
    }, [filters?.eventDate, filters?.radiusKm, filters?.sex]);

    const selectedEventType = useMemo(() => {
        if (selectedTab === 'all') {
            return undefined;
        }

        if (selectedTab === 'tastings') {
            return EventType.Tastings;
        }

        return EventType.Parties;
    }, [selectedTab]);

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
                eventType: selectedEventType,
                eventDate: filters?.eventDate,
                sex: filters?.sex,
            });
        } catch (error) {
            console.warn('useEventMap -> loadEvents: ', error);
        } finally {
            setIsLoadingEvents(false);
        }
    }, [filters?.eventDate, filters?.radiusKm, filters?.sex, getTargetLocation, selectedEventType]);

    useEffect(() => {
        if (!isFocused) {
            hasAutoLoadedOnFocusRef.current = false;
            lastLoadedEventTypeRef.current = undefined;
            lastLoadedFiltersKeyRef.current = '';
            return;
        }

        if (isLocationLoading) {
            return;
        }

        const targetLocation = getTargetLocation();
        const currentLocationKey = `${targetLocation.latitude}:${targetLocation.longitude}`;
        const isSameEventType = lastLoadedEventTypeRef.current === selectedEventType;
        const isSameLocation = lastLoadedLocationKeyRef.current === currentLocationKey;
        const isSameFilters = lastLoadedFiltersKeyRef.current === filtersKey;
        if (hasAutoLoadedOnFocusRef.current && isSameEventType && isSameLocation && isSameFilters) {
            return;
        }

        hasAutoLoadedOnFocusRef.current = true;
        lastLoadedEventTypeRef.current = selectedEventType;
        lastLoadedLocationKeyRef.current = currentLocationKey;
        lastLoadedFiltersKeyRef.current = filtersKey;
        loadEvents();
    }, [filtersKey, getTargetLocation, isFocused, isLocationLoading, loadEvents, selectedEventType]);

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

    const filteredMapPins = useMemo(() => {
        if (selectedTab === 'all') {
            return mapPins;
        }

        const eventType = selectedTab === 'tastings' ? EventType.Tastings : EventType.Parties;
        return mapPins.filter(pin => pin.eventType === eventType);
    }, [mapPins, selectedTab]);

    const refetch = useCallback((location?: IUserLocation | null) => {
        const targetLocation = getTargetLocation(location);
        hasAutoLoadedOnFocusRef.current = true;
        lastLoadedEventTypeRef.current = selectedEventType;
        lastLoadedLocationKeyRef.current = `${targetLocation.latitude}:${targetLocation.longitude}`;
        lastLoadedFiltersKeyRef.current = filtersKey;
        return loadEvents(targetLocation);
    }, [filtersKey, getTargetLocation, loadEvents, selectedEventType]);

    return {
        mapPins: filteredMapPins,
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
