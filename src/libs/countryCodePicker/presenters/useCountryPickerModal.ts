import { useCallback, useMemo, useState, type SetStateAction } from 'react';
import countries from 'world-countries';
import { localization } from '@/UIProvider/localization/Localization';
import { countryDisplayNames } from '@/UIProvider/localization/translations/countryDisplayNames';
import { ICountry } from '../types/ICountry';

type RegionDisplayNames = {
    of: (code: string) => string | undefined;
};

//TODO: Check after world-countries lib next updates
const iso2ToWorldCountriesTranslation: Record<string, string> = {
    ar: 'ara',
    cs: 'ces',
    de: 'deu',
    et: 'est',
    fi: 'fin',
    fr: 'fra',
    hr: 'hrv',
    hu: 'hun',
    it: 'ita',
    ja: 'jpn',
    ko: 'kor',
    nl: 'nld',
    fa: 'per',
    pl: 'pol',
    pt: 'por',
    ru: 'rus',
    sk: 'slk',
    es: 'spa',
    sr: 'srp',
    sv: 'swe',
    tr: 'tur',
    ur: 'urd',
    zh: 'zho',
    uk: 'ukr',
};

const buildDisplayNames = (locale: string): RegionDisplayNames | null => {
    const DisplayNames = (Intl as typeof Intl & { DisplayNames?: any }).DisplayNames;
    if (typeof DisplayNames !== 'function') return null;

    try {
        return new DisplayNames([locale], { type: 'region' });
    } catch {
        return null;
    }
};

const getLocalizedCountries = (locale: string, displayNames: RegionDisplayNames | null): ICountry[] => {
    const resolvedLocale = locale.toLowerCase();
    const translationKey = iso2ToWorldCountriesTranslation[resolvedLocale];
    const customNames = countryDisplayNames[resolvedLocale] || null;

    return countries.map((c: any) => {
        //TODO: Check after world-countries lib next updates
        const manualOverrides: Record<string, string> = {
            AQ: '+672', // Antarctica (uses Australian territory code)
            HM: '+672', // Heard and McDonald Islands (also managed by Australia)
        };

        const phoneCode =
            manualOverrides[c.cca2] || (c.idd?.root && c.idd?.suffixes ? `${c.idd.root}${c.idd.suffixes[0]}` : '');

        const localizedName =
            customNames?.[c.cca2] ||
            (displayNames?.of(c.cca2) as string | undefined) ||
            (translationKey ? c.translations?.[translationKey]?.common : undefined) ||
            c.name.common;

        return {
            name: localizedName,
            cca2: c.cca2,
            callingCode: phoneCode,
        };
    });
};

export const useCountryPickerModal = () => {
    const [search, setSearch] = useState('');
    const locale = localization.locale || 'en';

    const displayNames = useMemo(() => buildDisplayNames(locale), [locale]);

    const localizedCountries = useMemo(() => {
        return getLocalizedCountries(locale, displayNames).sort((a, b) => a.name.localeCompare(b.name, locale));
    }, [locale, displayNames]);

    const countriesData = useMemo(() => {
        const query = search.trim().toLocaleLowerCase(locale);

        if (!query) return localizedCountries;

        return localizedCountries.filter(country => country.name.toLocaleLowerCase(locale).includes(query));
    }, [search, locale, localizedCountries]);

    const handleSearchChange = useCallback((value: SetStateAction<string>) => {
        setSearch(value);
    }, []);

    return { countriesData, search, setSearch: handleSearchChange };
};
