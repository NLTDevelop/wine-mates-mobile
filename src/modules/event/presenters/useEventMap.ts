import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Region } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import { eventsModel } from '@/entities/events/EventsModel';
import { eventsService } from '@/entities/events/EventsService';
import { useLocationPermission } from '@/hooks/useLocationPermission.ts';
import { EventType } from '@/entities/events/enums/EventType';

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
    const lastLoadedEventTypeRef = useRef<EventType | undefined>(undefined);

    const selectedEventType = useMemo(() => {
        if (selectedTab === 'all') {
            return undefined;
        }

        if (selectedTab === 'tastings') {
            return EventType.Tastings;
        }

        return EventType.Parties;
    }, [selectedTab]);

    const loadEvents = useCallback(async () => {
        const location = userLocation || KYIV_COORDINATES;

        setIsLoadingEvents(true);
        try {
            await eventsService.getMapPins({
                latitude: location.latitude,
                longitude: location.longitude,
                radiusKm: DEFAULT_RADIUS_KM,
                eventType: selectedEventType,
            });
        } catch (error) {
            console.warn('useEventMap -> loadEvents: ', error);
        } finally {
            setIsLoadingEvents(false);
        }
    }, [selectedEventType, userLocation]);

    useEffect(() => {
        if (!isFocused) {
            hasAutoLoadedOnFocusRef.current = false;
            lastLoadedEventTypeRef.current = undefined;
            return;
        }

        if (isLocationLoading) {
            return;
        }

        const isSameEventType = lastLoadedEventTypeRef.current === selectedEventType;
        if (hasAutoLoadedOnFocusRef.current && isSameEventType) {
            return;
        }

        hasAutoLoadedOnFocusRef.current = true;
        lastLoadedEventTypeRef.current = selectedEventType;
        loadEvents();
    }, [isFocused, isLocationLoading, loadEvents, selectedEventType]);

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
            await eventsService.toggleSave(eventId);
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

    const mapPins = eventsModel.mapPins;

    const filteredMapPins = useMemo(() => {
        if (selectedTab === 'all') {
            return mapPins;
        }

        const eventType = selectedTab === 'tastings' ? EventType.Tastings : EventType.Parties;
        return mapPins.filter(pin => pin.eventType === eventType);
    }, [mapPins, selectedTab]);

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
