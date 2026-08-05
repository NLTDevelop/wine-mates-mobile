import { IGuestUser } from './IGuestUser';

export interface IEventGuestUsers {
    organizer: IGuestUser;
    guests: IGuestUser[];
}
