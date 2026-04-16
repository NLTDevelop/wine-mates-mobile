import { TastingType } from '@/entities/events/enums/TastingType';

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
        tastingType?: TastingType;
    };
};
