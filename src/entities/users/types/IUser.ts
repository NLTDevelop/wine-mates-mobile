import { WineExperienceLevelEnum } from "../enums/WineExperienceLevelEnum";

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
    wineExperienceLevel: WineExperienceLevelEnum;
    isConfirmed: true;
    hasPremium: boolean;
}
