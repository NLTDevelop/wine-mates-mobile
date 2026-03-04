import { MobXRepository } from '@/repository/MobXRepository';
import { IEvent, IEventDetail } from './types/IEvent';

export interface IEventsModel {
    events: IEvent[];
    selectedEventId: number | null;
    eventDetails: Map<number, IEventDetail>;
    setEvents: (events: IEvent[]) => void;
    setSelectedEventId: (id: number | null) => void;
    setEventDetail: (eventDetail: IEventDetail) => void;
    getEventDetail: (id: number) => IEventDetail | undefined;
    clear: () => void;
}

class EventsModel implements IEventsModel {
    private eventsRepository = new MobXRepository<IEvent[]>([]);
    private selectedEventIdRepository = new MobXRepository<number | null>(null);
    private eventDetailsRepository = new MobXRepository<Map<number, IEventDetail>>(new Map());

    public get events() {
        return this.eventsRepository.data || [];
    }

    public set events(value: IEvent[]) {
        this.eventsRepository.save(value);
    }

    public get selectedEventId() {
        return this.selectedEventIdRepository.data;
    }

    public set selectedEventId(value: number | null) {
        this.selectedEventIdRepository.save(value);
    }

    public get eventDetails() {
        return this.eventDetailsRepository.data || new Map();
    }

    public set eventDetails(value: Map<number, IEventDetail>) {
        this.eventDetailsRepository.save(value);
    }

    public setEvents(events: IEvent[]) {
        this.events = events;
    }

    public setSelectedEventId(id: number | null) {
        this.selectedEventId = id;
    }

    public setEventDetail(eventDetail: IEventDetail) {
        const details = new Map(this.eventDetails);
        details.set(eventDetail.id, eventDetail);
        this.eventDetails = details;
    }

    public getEventDetail(id: number): IEventDetail | undefined {
        return this.eventDetails.get(id);
    }

    public clear() {
        this.events = [];
        this.selectedEventId = null;
        this.eventDetails = new Map();
    }
}

export const eventsModel = new EventsModel();
