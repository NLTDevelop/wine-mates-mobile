import { IAvatar } from '@/entities/users/types/IUser';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';

export interface IGuestUser {
    id: number;
    firstName: string;
    lastName: string;
    birthday: string;
    wineExperienceLevel: WineExperienceLevelEnum;
    avatar?: IAvatar | null;
}
