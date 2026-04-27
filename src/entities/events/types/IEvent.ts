import { Sex } from '../enums/Sex';
import { Currency } from '../enums/Currency';
import { EventType } from '../enums/EventType';
import { TastingType } from '../enums/TastingType';
import { ParticipationCondition } from '../enums/ParticipationCondition';
import { IWineSetItem } from './IWineSetItem';

export interface IEvent {
    id: number;
    theme: string;
    eventDate: string;
    eventTime: string;
    price: number;
    priceUsd: number;
    currency: Currency;
    description: string;
    latitude: number;
    longitude: number;
    distanceKm: string;
    eventType?: EventType;
    tastingType?: TastingType;
    participationCondition?: ParticipationCondition;
}

export interface IEventDetail {
    id: number;
    latitude: number;
    longitude: number;
    title?: string;
    description: string;
    date?: string;
    eventDate?: string;
    startTime?: string;
    endTime?: string;
    eventTime?: string;
    attendees?: string[];
    attendeesCount?: number;
    price: number;
    eventType?: EventType;
    isSaved?: boolean;
    theme: string;
    restaurant?: string;
    restaurantName?: string;
    location?: string;
    locationLabel?: string;
    speaker?: string;
    speakerName?: string;
    distance?: number | string;
    distanceKm?: number | string | null;
    language: string;
    seats: number;
    currency?: Currency;
    tastingType?: TastingType;
    participationCondition?: ParticipationCondition;
    requiresConfirmation?: boolean;
    wineSet?: IWineSetItem[];
    minAge?: number;
    maxAge?: number;
    sex?: Sex;
}
