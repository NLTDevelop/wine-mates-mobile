import { IAvatar } from '@/entities/users/types/IUser';

export interface IEventParticipant {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: IAvatar | null;
}
