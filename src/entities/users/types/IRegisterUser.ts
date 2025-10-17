import { WineExperienceLevelEnum } from "../enums/WineExperienceLevelEnum";

export interface IRegisterUser {
    email: string;
    password: string;
    phoneNumber: string;
    country: string;
    wineExperienceLevel: WineExperienceLevelEnum;
    firstName: string;
    lastName: string;
    birthday: string;
    occupation?: string;
    wineryName?: string;
}
