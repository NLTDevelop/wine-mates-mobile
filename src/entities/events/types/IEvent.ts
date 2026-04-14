import { Sex } from '../enums/Sex';
import { Currency } from '../enums/Currency';
import { TastingType } from '../enums/TastingType';

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
    tastingType?: TastingType;
}

export interface IEventDetail {
    id: number;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    attendees: string[];
    attendeesCount: number;
    price: number;
    eventType: 'online' | 'offline';
    isSaved: boolean;
    theme: string;
    restaurant: string;
    location: string;
    speaker: string;
    distance: number;
    language: string;
    seats: number;
    wineSet?: string[];
    minAge?: number;
    maxAge?: number;
    sex?: Sex;
}
