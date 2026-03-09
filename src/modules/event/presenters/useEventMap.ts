import { useEffect, useMemo } from 'react';
import { Region } from 'react-native-maps';
import { eventsModel } from '@/entities/events/EventsModel';
import { MOCK_EVENTS } from '@/entities/events/mocks/eventMocks';
import { useLocationPermission } from '@/hooks/useLocationPermission.ts';

const KYIV_COORDINATES = {
    latitude: 50.4501,
    longitude: 30.5234,
};

const MAP_DELTA = {
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
};

export const useEventMap = () => {
    const { userLocation, isLoading: isLocationLoading } = useLocationPermission();

    useEffect(() => {
        if (eventsModel.events.length === 0) {
            eventsModel.setEvents(MOCK_EVENTS);
        }
    }, []);

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

    const handleMarkerPress = (markerId: number) => {
        eventsModel.setSelectedEventId(markerId);
    };

    return {
        events: eventsModel.events,
        initialRegion,
        selectedMarkerId: eventsModel.selectedEventId,
        handleMarkerPress,
        userLocation,
        isLocationLoading,
    };
};
