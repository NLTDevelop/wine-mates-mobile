import { WineExperienceLevelEnum } from '../enums/WineExperienceLevelEnum';
import { IWineryRegistration } from './IWineryRegistration';

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
    instagramLink?: string;
    gender?: string;
    placeOfWork?: string;
    winery?: IWineryRegistration;
}
