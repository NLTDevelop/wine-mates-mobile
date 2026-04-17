import { EventType } from '@/entities/events/enums/EventType';
import { IAddEventDraft } from '@/modules/event/types/IAddEventDraft';

export type EventStackParamList = {
    EventMapView: undefined;
    EventDetailsView: {
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
    AddWineSetView: {
        draft: IAddEventDraft;
    };
    EditEventWineView: {
        wineId: number;
    };
    LocationPickerView: {
        initialLocation?: { latitude: number; longitude: number } | null;
        eventType?: EventType;
    };
};
