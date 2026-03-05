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
    distance: string;
    language: string;
    seats: number;
    wineSet?: string[];
}
