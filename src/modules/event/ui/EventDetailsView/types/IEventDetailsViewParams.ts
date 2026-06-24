export type EventDetailsViewInitialTab = 'eventDetails' | 'guests';

export interface IEventDetailsViewParams {
    eventId: number;
    openedFromDeepLink?: boolean;
    initialTab?: EventDetailsViewInitialTab;
}
