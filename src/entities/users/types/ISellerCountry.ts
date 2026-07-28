import { ICountry } from '@/entities/wine/types/ICountry';

export interface ISellerCountry {
    id: number;
    countryId: number;
    country: ICountry;
}
