import { useEffect } from 'react';
import { Region } from 'react-native-maps';
import { IEvent } from '@/entities/events/types/IEvent';
import { eventsModel } from '@/entities/events/EventsModel';

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

const MOCK_EVENTS: IEvent[] = [
    {
        id: 1,
        latitude: 50.4501,
        longitude: 30.5234,
        title: 'Natural Wines & Pet-Nats',
        description: 'Thu, Dec 16',
        date: 'Thu, Dec 16',
        startTime: '8:00 AM',
        endTime: '11:00 AM',
        attendees: ['https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=2', 'https://i.pravatar.cc/150?img=3'],
        attendeesCount: 16,
        price: 3200,
        eventType: 'offline',
        isSaved: false,
    },
    {
        id: 2,
        latitude: 50.4601,
        longitude: 30.5334,
        title: 'Wine & Cheese Pairing',
        description: 'Fri, Dec 17',
        date: 'Fri, Dec 17',
        startTime: '6:00 PM',
        endTime: '9:00 PM',
        attendees: ['https://i.pravatar.cc/150?img=4', 'https://i.pravatar.cc/150?img=5'],
        attendeesCount: 12,
        price: 2500,
        eventType: 'offline',
        isSaved: true,
    },
    {
        id: 3,
        latitude: 50.4401,
        longitude: 30.5134,
        title: 'Virtual Wine Masterclass',
        description: 'Sat, Dec 18',
        date: 'Sat, Dec 18',
        startTime: '3:00 PM',
        endTime: '5:00 PM',
        attendees: ['https://i.pravatar.cc/150?img=6', 'https://i.pravatar.cc/150?img=7', 'https://i.pravatar.cc/150?img=8'],
        attendeesCount: 25,
        price: 1800,
        eventType: 'online',
        isSaved: false,
    },
];

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
