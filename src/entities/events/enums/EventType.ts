export enum EventType {
    Tastings = 'tastings',
    Parties = 'parties',
}

export const EVENT_TYPES = [EventType.Parties, EventType.Tastings] as const;
