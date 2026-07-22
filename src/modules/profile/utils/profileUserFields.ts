import { format } from 'date-fns';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import countries from 'world-countries';

export const getProfileCountryName = (cca2: string, locale: string) => {
    if (!cca2) return '';

    const country = countries.find(item => item.cca2?.toLowerCase() === cca2.toLowerCase());
    if (!country) return '';

    try {
        const formatter = new Intl.DisplayNames([locale || 'en'], { type: 'region' });
        const localized = formatter.of(country.cca2);
        if (localized) return localized;
    } catch {
        // Use the bundled country name below when Intl.DisplayNames is unavailable.
    }

    if ((locale || '').startsWith('uk')) {
        return country.name?.native?.ukr?.common || country.name?.common || '';
    }

    return country.name?.common || '';
};

export const getProfileBirthdayText = (birthday: string, locale: string) => {
    if (!birthday) return '';

    const date = new Date(birthday);
    if (Number.isNaN(date.getTime())) return '';

    try {
        return new Intl.DateTimeFormat(locale || 'en', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    } catch {
        return format(date, 'MMMM d, yyyy');
    }
};

export const getProfilePhoneParts = (phoneNumber: string) => {
    const parsed = parsePhoneNumberFromString(phoneNumber);
    if (!parsed) {
        return {
            cca2: null as string | null,
            callingCode: '',
            nationalNumber: phoneNumber,
        };
    }

    return {
        cca2: parsed.country ? parsed.country.toLowerCase() : null,
        callingCode: `+${parsed.countryCallingCode}`,
        nationalNumber: parsed.nationalNumber || '',
    };
};
