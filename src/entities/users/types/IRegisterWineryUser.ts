import { IWineryRegistration } from './IWineryRegistration';

export interface IRegisterWineryUser {
    user: {
        email: string;
        password: string;
        phoneNumber: string;
        country: string;
        birthday: string;
    };
    winery: IWineryRegistration;
}
