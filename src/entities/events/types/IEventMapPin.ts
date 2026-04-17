import { EventType } from '../enums/EventType';

export interface IEventMapPin {
    id: number;
    latitude: number;
    longitude: number;
    eventType: EventType;
}
