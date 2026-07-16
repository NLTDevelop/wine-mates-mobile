import { WineExperienceLevelEnum } from '../enums/WineExperienceLevelEnum';
import { IMedia } from '@/entities/media/types/IMedia';

export interface IAvatar {
    name: string;
    originalName: string;
    mimetype: string;
    size: number;
    smallUrl: string;
    mediumUrl: string;
    originalUrl: string;
}

export interface IUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    birthday: string;
    occupation: string;
    wineryName: string;
    gender: string;
    bio: string;
    country: string;
    phoneNumber: string;
    city: string;
    avatarUrl: string;
    avatar?: IAvatar;
    gallery: IMedia[];
    instagramLink: string;
    website: string;
    wineExperienceLevel: WineExperienceLevelEnum;
    isConfirmed: true;
    hasPremium: boolean;
    selectedCurrency: string | null;
    language?: string;
}
