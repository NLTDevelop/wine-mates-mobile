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
