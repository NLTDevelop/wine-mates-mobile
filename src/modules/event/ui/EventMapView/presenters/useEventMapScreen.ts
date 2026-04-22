import { useCallback, useMemo, useState } from 'react';
import { EventType } from '@/entities/events/enums/EventType';
import { useEventMap } from '@/modules/event/presenters/useEventMap';
import { useEventsList } from '@/modules/event/presenters/useEventsList';
import { useEventMapView } from '@/modules/event/presenters/useEventMapView';

export const useEventMapScreen = () => {
    const [isRefetching, setIsRefetching] = useState(false);

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
                onRefetchMapPins(),
                onRefetchEvents(),
            ]);
        } finally {
            setIsRefetching(false);
        }
    }, [isRefetching, onRefetchEvents, onRefetchMapPins]);

    return {
        isRefetching,
        selectedTab,
        filterCount,
        onTabChange,
        onFilterPress,
        onUpdateEvent,
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
