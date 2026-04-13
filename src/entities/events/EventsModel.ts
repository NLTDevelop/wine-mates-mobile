import { MobXRepository } from '@/repository/MobXRepository';
import { IEvent, IEventDetail } from './types/IEvent';
import { IEventMapPin } from './types/IEventMapPin';

export interface IEventsModel {
    events: IEvent[];
    selectedEventId: number | null;
    eventDetail: IEventDetail | null;
    mapPins: IEventMapPin[];
    setEvents: (events: IEvent[]) => void;
    setSelectedEventId: (id: number | null) => void;
    setEventDetail: (eventDetail: IEventDetail | null) => void;
    setMapPins: (pins: IEventMapPin[]) => void;
    clear: () => void;
}

class EventsModel implements IEventsModel {
    private eventsRepository = new MobXRepository<IEvent[]>([]);
    private selectedEventIdRepository = new MobXRepository<number | null>(null);
    private eventDetailRepository = new MobXRepository<IEventDetail | null>(null);
    private mapPinsRepository = new MobXRepository<IEventMapPin[]>([]);

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

    public get eventDetail() {
        return this.eventDetailRepository.data;
    }

    public set eventDetail(value: IEventDetail | null) {
        this.eventDetailRepository.save(value);
    }

    public get mapPins() {
        return this.mapPinsRepository.data || [];
    }

    public set mapPins(value: IEventMapPin[]) {
        this.mapPinsRepository.save(value);
    }

    public setEvents(events: IEvent[]) {
        this.events = events;
    }

    public setSelectedEventId(id: number | null) {
        this.selectedEventId = id;
    }

    public setEventDetail(eventDetail: IEventDetail | null) {
        this.eventDetail = eventDetail;
    }

    public setMapPins(pins: IEventMapPin[]) {
        this.mapPins = pins;
    }

    public clear() {
        this.events = [];
        this.selectedEventId = null;
        this.eventDetail = null;
        this.mapPins = [];
    }
}

export const eventsModel = new EventsModel();
