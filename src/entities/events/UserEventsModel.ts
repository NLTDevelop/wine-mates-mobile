import { IList } from '@/entities/IList';
import { IEvent } from '@/entities/events/types/IEvent';
import { MobXRepository } from '@/repository/MobXRepository';

interface IUserEventsModel {
    list: IList<IEvent> | null;
    append: (value: IList<IEvent>) => void;
}

class UserEventsModel implements IUserEventsModel {
    private listRepository = new MobXRepository<IList<IEvent> | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IList<IEvent> | null) {
        this.listRepository.save(value);
    }

    public append(value: IList<IEvent>) {
        if (!this.list) {
            this.list = value;
            return;
        }

        this.list = {
            ...value,
            rows: [...this.list.rows, ...value.rows],
        };
    }
}

export const userEventsModel = new UserEventsModel();
