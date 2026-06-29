import { EventType } from '@/entities/events/enums/EventType';
import { ParticipationCondition } from '@/entities/events/enums/ParticipationCondition';
import { Sex } from '@/entities/events/enums/Sex';
import { TastingType } from '@/entities/events/enums/TastingType';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { RepeatRuleConfig } from '@/entities/events/types/RepeatRuleConfig';

export interface IAddEventCreateFormDraft {
    theme: string;
    description: string;
    restaurantName: string;
    locationLabel: string;
    locationCountry: string;
    location: { latitude: number; longitude: number } | null;
    eventStartDate: string;
    eventEndDate: string;
    eventStartTime: string;
    eventEndTime: string;
    price: string;
    currency: string;
    speakerName: string;
    language: string;
    seats: string;
    minAge: number;
    maxAge: number;
    sex?: Sex;
    eventType: EventType;
    tastingType: TastingType;
    participationCondition?: ParticipationCondition;
    requiresConfirmation?: boolean;
    paymentMethodIds: number[];
    contactIds: number[];
}

export interface IAddEventCreateWineSetDraft {
    selectedWines: IWineSetSearchItem[];
    repeatRule: RepeatRuleConfig | null;
    tastingType: TastingType;
}

export interface IAddEventCreateDraftCache {
    form: IAddEventCreateFormDraft;
    wineSet: IAddEventCreateWineSetDraft | null;
}
