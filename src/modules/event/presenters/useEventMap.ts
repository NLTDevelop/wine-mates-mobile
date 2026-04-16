import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Region } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import { eventsModel } from '@/entities/events/EventsModel';
import { eventService } from '@/entities/events/EventService';
import { useLocationPermission } from '@/hooks/useLocationPermission.ts';
import { TastingType } from '@/entities/events/enums/TastingType';

const KYIV_COORDINATES = {
    latitude: 50.4501,
    longitude: 30.5234,
};

const MAP_DELTA = {
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
};

const DEFAULT_RADIUS_KM = 100;

export const useEventMap = () => {
    const isFocused = useIsFocused();
    const { userLocation, isLoading: isLocationLoading } = useLocationPermission();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'all' | 'tastings' | 'parties'>('all');
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [filterCount] = useState(0);
    const hasAutoLoadedOnFocusRef = useRef(false);
    const lastLoadedTastingTypeRef = useRef<TastingType | undefined>(undefined);

    const selectedTastingType = useMemo(() => {
        if (selectedTab === 'all') {
            return undefined;
        }

        if (selectedTab === 'tastings') {
            return TastingType.Tastings;
        }

        return TastingType.Parties;
    }, [selectedTab]);

    const loadEvents = useCallback(async () => {
        const location = userLocation || KYIV_COORDINATES;

        setIsLoadingEvents(true);
        try {
            await eventService.getMapPins({
                latitude: location.latitude,
                longitude: location.longitude,
                radiusKm: DEFAULT_RADIUS_KM,
                tastingType: selectedTastingType,
            });
        } catch (error) {
            console.warn('useEventMap -> loadEvents: ', error);
        } finally {
            setIsLoadingEvents(false);
        }
    }, [selectedTastingType, userLocation]);

    useEffect(() => {
        if (!isFocused) {
            hasAutoLoadedOnFocusRef.current = false;
            lastLoadedTastingTypeRef.current = undefined;
            return;
        }

        if (isLocationLoading) {
            return;
        }

        const isSameTastingType = lastLoadedTastingTypeRef.current === selectedTastingType;
        if (hasAutoLoadedOnFocusRef.current && isSameTastingType) {
            return;
        }

        hasAutoLoadedOnFocusRef.current = true;
        lastLoadedTastingTypeRef.current = selectedTastingType;
        loadEvents();
    }, [isFocused, isLocationLoading, loadEvents, selectedTastingType]);

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

    const mapRegionKey = useMemo(() => {
        return `${initialRegion.latitude}:${initialRegion.longitude}`;
    }, [initialRegion.latitude, initialRegion.longitude]);

    const onMarkerPress = useCallback((markerId: number) => {
        eventsModel.setSelectedEventId(markerId);
        setIsModalVisible(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const onFavoritePress = useCallback(async (eventId: number) => {
        try {
            await eventService.toggleSave(eventId);
        } catch (error) {
            console.warn('useEventMap -> onFavoritePress: ', error);
        }
    }, []);

    const onTabChange = useCallback((tab: 'all' | 'tastings' | 'parties') => {
        setSelectedTab(tab);
    }, []);

    const onFilterPress = useCallback(() => {
        setIsFilterModalVisible(true);
    }, []);

    const onCloseFilterModal = useCallback(() => {
        setIsFilterModalVisible(false);
    }, []);

    const filteredMapPins = useMemo(() => {
        const pins = eventsModel.mapPins;
        if (selectedTab === 'all') {
            return pins;
        }
        const tastingType = selectedTab === 'tastings' ? TastingType.Tastings : TastingType.Parties;
        return pins.filter(pin => pin.tastingType === tastingType);
    }, [selectedTab]);

    const refetch = useCallback(() => {
        loadEvents();
    }, [loadEvents]);

    return {
        mapPins: filteredMapPins,
        initialRegion,
        mapRegionKey,
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
        onFilterPress,
        isFilterModalVisible,
        onCloseFilterModal,
        filterCount,
        refetch,
    };
};
