import { CountryCode } from 'libphonenumber-js';

export interface ICountry {
    id?: number;
    name: string;
    cca2: CountryCode;
    callingCode: string;
}
