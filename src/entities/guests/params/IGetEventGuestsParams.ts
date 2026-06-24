import { GuestsBookingStatuses } from '../enums/GuestsBookingStatuses';

export interface IGetEventGuestsParams {
    eventId: number;
    status?: GuestsBookingStatuses | 'all';
    offset: number;
    limit: number;
}
