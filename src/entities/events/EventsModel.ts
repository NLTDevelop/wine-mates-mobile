import { MobXRepository } from '@/repository/MobXRepository';
import { IEvent, IEventDetail } from './types/IEvent';
import { IEventMapPin } from './types/IEventMapPin';
import { IList } from '../IList';
import { IEventFilters } from '@/modules/event/types/IEventFilters';
import { IEventPriceRange } from './types/IEventPriceRange';
import { IAppliedEvent } from './types/IAppliedEvent';
import { ISavedEvent } from './types/ISavedEvent';

export interface IEventsModel {
    list: IList<IEvent> | null;
    events: IEvent[];
    appliedEvents: IAppliedEvent[];
    savedEvents: IList<ISavedEvent> | null;
    createdEvents: IList<IEvent> | null;
    selectedEventId: number | null;
    eventDetail: IEventDetail | null;
    mapPins: IEventMapPin[];
    eventPriceRange: IEventPriceRange | null;
    eventFilters: IEventFilters;
    setEvents: (events: IEvent[]) => void;
    setList: (list: IList<IEvent>) => void;
    append: (value: IList<IEvent>) => void;
    setSelectedEventId: (id: number | null) => void;
    setEventDetail: (eventDetail: IEventDetail | null) => void;
    setMapPins: (pins: IEventMapPin[]) => void;
    setEventPriceRange: (priceRange: IEventPriceRange | null) => void;
    setEventFilters: (filters: IEventFilters) => void;
    clearEventFilters: () => void;
    clear: () => void;
}

class EventsModel implements IEventsModel {
    private listRepository = new MobXRepository<IList<IEvent> | null>(null);
    private selectedEventIdRepository = new MobXRepository<number | null>(null);
    private eventDetailRepository = new MobXRepository<IEventDetail | null>(null);
    private mapPinsRepository = new MobXRepository<IEventMapPin[]>([]);
    private eventPriceRangeRepository = new MobXRepository<IEventPriceRange | null>(null);
    private eventFiltersRepository = new MobXRepository<IEventFilters>({});
    private appliedEventsRepository = new MobXRepository<IAppliedEvent[]>([]);
    private savedEventsRepository = new MobXRepository<IList<ISavedEvent> | null>(null);
    private createdEventsRepository = new MobXRepository<IList<IEvent> | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IList<IEvent> | null) {
        this.listRepository.save(value);
    }

    public get events() {
        return this.list?.rows || [];
    }

    public get appliedEvents() {
        return this.appliedEventsRepository.data || [];
    }

    public set appliedEvents(value: IAppliedEvent[]) {
        this.appliedEventsRepository.save(value);
    }

    public get savedEvents(){
        return this.savedEventsRepository.data;
    }

    public set savedEvents(value: IList<ISavedEvent> | null) {
        this.savedEventsRepository.save(value);
    }

    public get createdEvents() {
        return this.createdEventsRepository.data;
    }

    public set createdEvents(value: IList<IEvent> | null) {
        this.createdEventsRepository.save(value);
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

    public get eventPriceRange() {
        return this.eventPriceRangeRepository.data;
    }

    public set eventPriceRange(value: IEventPriceRange | null) {
        this.eventPriceRangeRepository.save(value);
    }

    public get eventFilters() {
        return this.eventFiltersRepository.data || {};
    }

    public set eventFilters(value: IEventFilters) {
        this.eventFiltersRepository.save(value);
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

    public appendSavedEvents(value: IList<ISavedEvent>) {
        if (this.savedEvents) {
            this.savedEvents = {
                ...this.savedEvents,
                ...value,
                rows: [...this.savedEvents.rows, ...value.rows],
            };
            return;
        }

        this.savedEvents = value;
    }

        public appendCreatedEvents(value: IList<IEvent>) {
        if (this.createdEvents) {
            this.createdEvents = {
                ...this.createdEvents,
                ...value,
                rows: [...this.createdEvents.rows, ...value.rows],
            };
            return;
        }

        this.createdEvents = value;
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

    public setEventPriceRange(priceRange: IEventPriceRange | null) {
        this.eventPriceRange = priceRange;
    }

    public setEventFilters(filters: IEventFilters) {
        this.eventFilters = filters;
    }

    public clearEventFilters() {
        this.eventFilters = {};
    }

    public clear() {
        this.list = null;
        this.appliedEvents = [];
        this.savedEvents = null;
        this.createdEvents = null;
        this.selectedEventId = null;
        this.eventDetail = null;
        this.mapPins = [];
        this.eventPriceRange = null;
        this.eventFilters = {};
    }
}

export const eventsModel = new EventsModel();
