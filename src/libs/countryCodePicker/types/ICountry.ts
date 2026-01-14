import { CountryCode } from 'libphonenumber-js';

export interface ICountry {
    name: string;
    cca2: CountryCode;
    callingCode: string;
}
