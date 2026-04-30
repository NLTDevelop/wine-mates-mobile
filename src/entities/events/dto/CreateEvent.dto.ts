import { RepeatRule } from '../enums/RepeatRule';
import { EventType } from '../enums/EventType';
import { TastingType } from '../enums/TastingType';
import { ParticipationCondition } from '../enums/ParticipationCondition';
import { Sex } from '../enums/Sex';

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
    price: number;
    currency: string;
    speakerName: string;
    language: string;
    seats: number;
    phoneNumber: string;
    minAge?: number;
    maxAge?: number;
    sex?: Sex;
    eventType: EventType;
    tastingType: TastingType;
    participationCondition?: ParticipationCondition;
    requiresConfirmation: boolean;
    repeatRule: RepeatRule;
    wineSet?: IWineSetItem[];
}
