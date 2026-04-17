import { MobXRepository } from '@/repository/MobXRepository';
import { IEvent, IEventDetail } from './types/IEvent';
import { IEventMapPin } from './types/IEventMapPin';
import { IList } from '../IList';

export interface IEventsModel {
    list: IList<IEvent> | null;
    events: IEvent[];
    selectedEventId: number | null;
    eventDetail: IEventDetail | null;
    mapPins: IEventMapPin[];
    setEvents: (events: IEvent[]) => void;
    setList: (list: IList<IEvent>) => void;
    append: (value: IList<IEvent>) => void;
    setSelectedEventId: (id: number | null) => void;
    setEventDetail: (eventDetail: IEventDetail | null) => void;
    setMapPins: (pins: IEventMapPin[]) => void;
    clear: () => void;
}

class EventsModel implements IEventsModel {
    private listRepository = new MobXRepository<IList<IEvent> | null>(null);
    private selectedEventIdRepository = new MobXRepository<number | null>(null);
    private eventDetailRepository = new MobXRepository<IEventDetail | null>(null);
    private mapPinsRepository = new MobXRepository<IEventMapPin[]>([]);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IList<IEvent> | null) {
        this.listRepository.save(value);
    }

    public get events() {
        return this.list?.rows || [];
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
        const currentList = this.list;
        if (currentList) {
            this.list = {
                ...currentList,
                rows: events,
            };
            return;
        }

        this.list = {
            rows: events,
            count: events.length,
            totalPages: 1,
        };
    }

    public setList(list: IList<IEvent>) {
        this.list = list;
    }

    public append(value: IList<IEvent>) {
        if (this.list) {
            this.list = {
                ...this.list,
                ...value,
                rows: [...this.list.rows, ...value.rows],
            };
            return;
        }

        this.list = value;
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
        this.list = null;
        this.selectedEventId = null;
        this.eventDetail = null;
        this.mapPins = [];
    }
}

export const eventsModel = new EventsModel();
