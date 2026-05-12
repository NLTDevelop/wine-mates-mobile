import { GuestsBookingStatuses } from '../enums/GuestsBookingStatuses';

export interface UpdateGuestBookingStatusDto {
    status: GuestsBookingStatuses.ACCEPTED | GuestsBookingStatuses.REJECTED;
}
