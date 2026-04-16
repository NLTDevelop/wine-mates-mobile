import { useCallback, useMemo, useState } from 'react';
import { TastingType } from '@/entities/events/enums/TastingType';
import { useEventMap } from '@/modules/event/presenters/useEventMap';
import { useEventsList } from '@/modules/event/presenters/useEventsList';
import { useEventMapView } from '@/modules/event/presenters/useEventMapView';

export const useEventMapScreen = () => {
    const [isRefetching, setIsRefetching] = useState(false);

    const {
        mapPins,
        initialRegion,
        mapRegionKey,
        userLocation,
        selectedTab,
        onTabChange,
        onFilterPress,
        isFilterModalVisible,
        onCloseFilterModal,
        filterCount,
        refetch: onRefetchMapPins,
    } = useEventMap();

    const {
        events,
        refetch: onRefetchEvents,
    } = useEventsList();

    const {
        selectedEvent,
        isModalVisible,
        onAddEvent,
        onMarkerPress,
        onCloseModal,
        onBookingPress,
        onModalFavoritePress,
        onReadMorePress,
        onFavoritePress,
    } = useEventMapView({ events });

    const filteredEvents = useMemo(() => {
        if (selectedTab === 'all') {
            return events;
        }

        const tastingType = selectedTab === 'tastings'
            ? TastingType.Tastings
            : TastingType.Parties;

        return events.filter(event => event.tastingType === tastingType);
    }, [events, selectedTab]);

    const onUpdateEvent = useCallback(async () => {
        setIsRefetching(true);
        try {
            await Promise.all([
                onRefetchMapPins(),
                onRefetchEvents(),
            ]);
        } finally {
            setIsRefetching(false);
        }
    }, [onRefetchEvents, onRefetchMapPins]);

    return {
        isRefetching,
        selectedTab,
        filterCount,
        onTabChange,
        onFilterPress,
        onUpdateEvent,
        mapPins,
        initialRegion,
        mapRegionKey,
        onMarkerPress,
        userLocation,
        filteredEvents,
        onReadMorePress,
        onFavoritePress,
        onAddEvent,
        selectedEvent,
        isModalVisible,
        onCloseModal,
        onBookingPress,
        onModalFavoritePress,
        isFilterModalVisible,
        onCloseFilterModal,
    };
};
