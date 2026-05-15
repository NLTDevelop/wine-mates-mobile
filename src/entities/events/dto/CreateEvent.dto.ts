import { EventType } from '../enums/EventType';
import { TastingType } from '../enums/TastingType';
import { ParticipationCondition } from '../enums/ParticipationCondition';
import { Sex } from '../enums/Sex';
import { RepeatRuleConfig } from '../types/RepeatRuleConfig';

interface IWineSetItem {
    wineId: number;
    sortOrder: number;
}

export interface CreateEventDto {
    theme: string;
    description: string;
    restaurantName: string;
    locationLabel: string;
    latitude: number;
    longitude: number;
    eventStartDate: string;
    eventEndDate: string;
    eventStartTime: string;
    eventEndTime: string;
    paymentMethodIds: number[];
    contactIds: number[];
    price: number;
    currency: string;
    speakerName: string;
    language: string;
    seats: number;
    minAge?: number;
    maxAge?: number;
    sex?: Sex;
    eventType: EventType;
    tastingType: TastingType;
    participationCondition?: ParticipationCondition;
    requiresConfirmation: boolean;
    repeatRule: RepeatRuleConfig | null;
    wineSet?: IWineSetItem[];
}
