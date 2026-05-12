import { IAvatar } from '@/entities/users/types/IUser';

export interface IGuestUser {
    id: number;
    firstName: string;
    lastName: string;
    birthday: string;
    avatar?: IAvatar | null;
}
