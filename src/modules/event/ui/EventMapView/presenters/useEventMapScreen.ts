import { useCallback, useMemo, useState } from 'react';
import { MapPressEvent, Region } from 'react-native-maps';
import { EventType } from '@/entities/events/enums/EventType';
import { useEventMap } from '@/modules/event/presenters/useEventMap';
import { useEventsList } from '@/modules/event/presenters/useEventsList';
import { useEventMapView } from '@/modules/event/presenters/useEventMapView';
import { IUserLocation } from '@/entities/location/types/IUserLocation';

const USER_LOCATION_REGION_THRESHOLD = 0.005;

export const useEventMapScreen = () => {
    const [isRefetching, setIsRefetching] = useState(false);
    const [searchLocation, setSearchLocation] = useState<IUserLocation | null>(null);

    const {
        mapPins,
        initialRegion,
        userLocation,
        selectedTab,
        onTabChange,
        onFilterPress,
        isFilterModalVisible,
        onCloseFilterModal,
        filterCount,
        refetch: onRefetchMapPins,
    } = useEventMap({ searchLocation });

    const {
        events,
        refetch: onRefetchEvents,
    } = useEventsList({ searchLocation });

    const {
        selectedEvent,
        isModalVisible,
        onAddEvent,
        onMarkerPress,
        onCloseModal,
        onModalReadMorePress,
        onModalFavoritePress,
        onReadMorePress,
        onFavoritePress,
    } = useEventMapView({ events });

    const filteredEvents = useMemo(() => {
        if (selectedTab === 'all') {
            return events;
        }

        const eventType = selectedTab === 'tastings'
            ? EventType.Tastings
            : EventType.Parties;

        return events.filter(event => event.eventType === eventType);
    }, [events, selectedTab]);

    const onUpdateEvent = useCallback(async () => {
        if (isRefetching) {
            return;
        }

        setIsRefetching(true);
        try {
            await Promise.all([
                onRefetchMapPins(searchLocation),
                onRefetchEvents(searchLocation),
            ]);
        } finally {
            setIsRefetching(false);
        }
    }, [isRefetching, onRefetchEvents, onRefetchMapPins, searchLocation]);

    const onMapPress = useCallback(async (event: MapPressEvent) => {
        if (isRefetching) {
            return;
        }

        const { action, coordinate } = event.nativeEvent;
        if (action && action !== 'press') {
            return;
        }

        const nextLocation: IUserLocation = {
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
        };

        setSearchLocation(nextLocation);
        setIsRefetching(true);
        try {
            await Promise.all([
                onRefetchMapPins(nextLocation),
                onRefetchEvents(nextLocation),
            ]);
        } finally {
            setIsRefetching(false);
        }
    }, [isRefetching, onRefetchEvents, onRefetchMapPins]);

    const onResetToCurrentLocation = useCallback(async () => {
        if (isRefetching) {
            return;
        }

        setSearchLocation(null);
        setIsRefetching(true);
        try {
            await Promise.all([
                onRefetchMapPins(userLocation),
                onRefetchEvents(userLocation),
            ]);
        } finally {
            setIsRefetching(false);
        }
    }, [isRefetching, onRefetchEvents, onRefetchMapPins, userLocation]);

    const onRegionChangeComplete = useCallback(async (region: Region) => {
        if (!searchLocation || !userLocation) {
            return;
        }

        const isNearUserLatitude = Math.abs(region.latitude - userLocation.latitude) <= USER_LOCATION_REGION_THRESHOLD;
        const isNearUserLongitude = Math.abs(region.longitude - userLocation.longitude) <= USER_LOCATION_REGION_THRESHOLD;
        if (!isNearUserLatitude || !isNearUserLongitude) {
            return;
        }

        await onResetToCurrentLocation();
    }, [onResetToCurrentLocation, searchLocation, userLocation]);

    return {
        isRefetching,
        selectedTab,
        filterCount,
        onTabChange,
        onFilterPress,
        onUpdateEvent,
        onMapPress,
        onRegionChangeComplete,
        searchLocation,
        mapPins,
        initialRegion,
        onMarkerPress,
        userLocation,
        filteredEvents,
        onReadMorePress,
        onFavoritePress,
        onAddEvent,
        selectedEvent,
        isModalVisible,
        onCloseModal,
        onModalReadMorePress,
        onModalFavoritePress,
        isFilterModalVisible,
        onCloseFilterModal,
    };
};
