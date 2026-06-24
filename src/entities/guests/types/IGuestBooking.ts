import { GuestsBookingStatuses } from '../enums/GuestsBookingStatuses';
import { IGuestUser } from './IGuestUser';

export interface IGuestBooking {
    id: number;
    status: GuestsBookingStatuses;
    createdAt: string;
    user: IGuestUser;
}
