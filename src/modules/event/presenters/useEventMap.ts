import { useEffect } from 'react';
import { Region } from 'react-native-maps';
import { eventsModel } from '@/entities/events/EventsModel';
import { MOCK_EVENTS } from '@/entities/events/mocks/eventMocks';

const KYIV_COORDINATES = {
    latitude: 50.4501,
    longitude: 30.5234,
};

const MAP_DELTA = {
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

const INITIAL_REGION: Region = {
    ...KYIV_COORDINATES,
    ...MAP_DELTA,
};

export const useEventMap = () => {
    useEffect(() => {
        if (eventsModel.events.length === 0) {
            eventsModel.setEvents(MOCK_EVENTS);
        }
    }, []);

    const handleMarkerPress = (markerId: number) => {
        eventsModel.setSelectedEventId(markerId);
    };

    return {
        events: eventsModel.events,
        initialRegion: INITIAL_REGION,
        selectedMarkerId: eventsModel.selectedEventId,
        handleMarkerPress,
    };
};
