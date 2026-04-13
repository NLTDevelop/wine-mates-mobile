import { Sex } from '../enums/Sex';

export interface IEvent {
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
    distance?: number;
    language?: string;
    theme?: string;
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
