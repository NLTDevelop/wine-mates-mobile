import { Sex } from '../enums/Sex';
import { Currency } from '../enums/Currency';
import { EventType } from '../enums/EventType';
import { TastingType } from '../enums/TastingType';
import { ParticipationCondition } from '../enums/ParticipationCondition';
import { IWineSetItem } from './IWineSetItem';
import { RepeatRuleConfig } from './RepeatRuleConfig';
import { IEventParticipant } from './IEventParticipant';

export interface IEvent {
    id: number;
    ownerId?: number;
    isActive?: boolean;
    isApplied?: boolean;
    isTastingStarted?: boolean;
    theme: string;
    eventDate?: string;
    eventTime?: string;
    eventStartDate?: string;
    eventEndDate?: string;
    eventStartTime?: string;
    eventEndTime?: string;
    phoneNumber?: string;
    restaurantName?: string;
    locationLabel?: string;
    price: number;
    priceUsd: number;
    currency: Currency | string;
    description: string;
    latitude: number;
    longitude: number;
    distanceKm: string | number | null;
    acceptedCount?: number;
    participants?: IEventParticipant[];
    isSaved?: boolean;
    eventType?: EventType;
    tastingType?: TastingType;
    seats?: ISeat;
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

export interface ISeat{
    total: number;
    left: number;
}

export interface IEventDetail {
    id: number;
    ownerId?: number;
    isActive?: boolean;
    isApplied?: boolean;
    isTastingStarted?: boolean;
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
    phoneNumber?: string;
    attendees?: string[];
    attendeesCount?: number;
    contacts?: IEventContact[];
    acceptedCount?: number;
    participants?: IEventParticipant[];
    price: number;
    eventType?: EventType;
    repeatRule?: RepeatRuleConfig | null;
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
    seats?: ISeat;
    currency?: Currency;
    tastingType?: TastingType;
    participationCondition?: ParticipationCondition;
    requiresConfirmation?: boolean;
    wineSet?: IWineSetItem[];
    minAge?: number;
    maxAge?: number;
    sex?: Sex;
}
