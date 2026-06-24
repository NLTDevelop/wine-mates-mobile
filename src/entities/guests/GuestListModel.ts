import { MobXRepository } from '@/repository/MobXRepository';
import { IList } from '../IList';
import { IGuestBooking } from './types/IGuestBooking';

export interface IGuestListModel {
    guests: IList<IGuestBooking> | null;
    append: (value: IList<IGuestBooking>) => void;
    clear: () => void;
}

class GuestListModel implements IGuestListModel {
    private guestsRepository = new MobXRepository<IList<IGuestBooking> | null>(null);

    public get guests() {
        return this.guestsRepository.data;
    }

    public set guests(value: IList<IGuestBooking> | null) {
        this.guestsRepository.save(value);
    }

    public append(value: IList<IGuestBooking>) {
        if (this.guests) {
            this.guests = {
                ...this.guests,
                ...value,
                rows: [...this.guests.rows, ...value.rows],
            };

            return;
        }

        this.guests = value;
    }

    public clear() {
        this.guests = null;
    }
}

export const guestListModel = new GuestListModel();
