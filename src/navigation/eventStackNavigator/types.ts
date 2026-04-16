import { EventType } from '@/entities/events/enums/EventType';

export type EventStackParamList = {
    EventMapView: undefined;
    EventDetails: {
        eventId: number;
    };
    AddEventView: {
        pickedLocation?: {
            latitude: number;
            longitude: number;
            label: string;
            placeName?: string;
        };
    } | undefined;
    LocationPickerView: {
        initialLocation?: { latitude: number; longitude: number } | null;
        eventType?: EventType;
    };
};
