import { EventType } from '@/entities/events/enums/EventType';
import { IAddEventDraft } from '@/modules/event/types/IAddEventDraft';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';

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
            countryName?: string;
        };
    } | undefined;
    AddWineSetView: {
        draft: IAddEventDraft;
        initialSelectedWines?: IWineSetSearchItem[];
        selectedWine?: IWineSetSearchItem;
        replacedWine?: {
            previousWineId: number;
            newWine: IWineSetSearchItem;
        };
    };
    EditEventWineView: {
        wineId: number;
        wine: IWineSetSearchItem;
        draft: IAddEventDraft;
        selectedWines: IWineSetSearchItem[];
    };
    LocationPickerView: {
        initialLocation?: { latitude: number; longitude: number } | null;
        eventType?: EventType;
    };
    EventFiltersView: undefined;
};
