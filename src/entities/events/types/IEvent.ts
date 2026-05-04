import { Sex } from '../enums/Sex';
import { Currency } from '../enums/Currency';
import { EventType } from '../enums/EventType';
import { TastingType } from '../enums/TastingType';
import { ParticipationCondition } from '../enums/ParticipationCondition';
import { IWineSetItem } from './IWineSetItem';

export interface IEvent {
    id: number;
    theme: string;
    eventDate?: string;
    eventTime?: string;
    eventStartDate?: string;
    eventEndDate?: string;
    eventStartTime?: string;
    eventEndTime?: string;
    price: number;
    priceUsd: number;
    currency: Currency | string;
    description: string;
    latitude: number;
    longitude: number;
    distanceKm: string | number | null;
    acceptedCount?: number;
    seats?: {
        total?: number;
        left?: number;
    };
    isSaved?: boolean;
    eventType?: EventType;
    tastingType?: TastingType;
    participationCondition?: ParticipationCondition;
}

export interface IEventContact {
    id: number;
    contactId: number;
    eventId: number;
    name: string;
    value: string;
    isVisible: boolean;
    createdAt?: string;
    updatedAt?: string;
    EventContact?: {
        id: number;
        contactId: number;
        eventId: number;
        createdAt?: string;
        updatedAt?: string;
    };
}

export interface IEventDetail {
    id: number;
    latitude: number;
    longitude: number;
    title?: string;
    description: string;
    date?: string;
    eventDate?: string;
    eventStartDate?: string;
    eventEndDate?: string;
    startTime?: string;
    endTime?: string;
    eventTime?: string;
    eventStartTime?: string;
    eventEndTime?: string;
    attendees?: string[];
    attendeesCount?: number;
    contacts?: IEventContact[];
    acceptedCount?: number;
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
    seats: number | {
        total?: number;
        left?: number;
    };
    currency?: Currency;
    tastingType?: TastingType;
    participationCondition?: ParticipationCondition;
    requiresConfirmation?: boolean;
    wineSet?: IWineSetItem[];
    minAge?: number;
    maxAge?: number;
    sex?: Sex;
}
