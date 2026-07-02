import { EventType } from '@/entities/events/enums/EventType';
import { IAddEventDraft } from '@/modules/event/types/IAddEventDraft';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { IUserLocation } from '@/entities/location/types/IUserLocation';

export type EventStackParamList = {
    EventMapView: undefined;
    AddEventView: {
        pickedLocation?: {
            latitude: number;
            longitude: number;
            label: string;
            placeName?: string;
            countryName?: string;
        };
        draft?: IAddEventDraft;
        initialSelectedWines?: IWineSetSearchItem[];
        editEventId?: number;
        isDuplicateEvent?: boolean;
    } | undefined;
    AddWineSetView: {
        draft: IAddEventDraft;
        initialSelectedWines?: IWineSetSearchItem[];
        editEventId?: number;
        isDuplicateEvent?: boolean;
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
        editEventId?: number;
        isDuplicateEvent?: boolean;
    };
    LocationPickerView: {
        initialLocation?: { latitude: number; longitude: number } | null;
        eventType?: EventType;
        isDuplicateEvent?: boolean;
    };
    EventFiltersView: {
        searchLocation?: IUserLocation | null;
        selectedEventType?: EventType;
    } | undefined;
};
