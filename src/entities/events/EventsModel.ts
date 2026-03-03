import { MobXRepository } from '@/repository/MobXRepository';
import { IEvent } from './types/IEvent';

export interface IEventsModel {
    events: IEvent[];
    selectedEventId: number | null;
    setEvents: (events: IEvent[]) => void;
    setSelectedEventId: (id: number | null) => void;
    clear: () => void;
}

class EventsModel implements IEventsModel {
    private eventsRepository = new MobXRepository<IEvent[]>([]);
    private selectedEventIdRepository = new MobXRepository<number | null>(null);

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

    public setEvents(events: IEvent[]) {
        this.events = events;
    }

    public setSelectedEventId(id: number | null) {
        this.selectedEventId = id;
    }

    public clear() {
        this.events = [];
        this.selectedEventId = null;
    }
}

export const eventsModel = new EventsModel();
