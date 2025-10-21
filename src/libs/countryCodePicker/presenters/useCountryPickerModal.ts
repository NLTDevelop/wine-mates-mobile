import { useCallback, useEffect, useMemo, useState, useDeferredValue, type SetStateAction } from 'react';
import countries from 'world-countries';
import { localization } from '@/UIProvider/localization/Localization';
import { countryDisplayNames } from '@/UIProvider/localization/translations/countryDisplayNames';
import { ICountry } from '../types/ICountry';

// --- Cache to prevent recalculations across modal instances ---
let cachedCountries: ICountry[] | null = null;
let cachedLocale: string | null = null;

type RegionDisplayNames = { of: (code: string) => string | undefined };

// Localized ISO language mapping
const iso2ToWorldCountriesTranslation: Record<string, string> = {
  ar: 'ara', cs: 'ces', de: 'deu', et: 'est', fi: 'fin', fr: 'fra',
  hr: 'hrv', hu: 'hun', it: 'ita', ja: 'jpn', ko: 'kor', nl: 'nld',
  fa: 'per', pl: 'pol', pt: 'por', ru: 'rus', sk: 'slk', es: 'spa',
  sr: 'srp', sv: 'swe', tr: 'tur', ur: 'urd', zh: 'zho', uk: 'ukr',
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
        const manualOverrides: Record<string, string> = {
            AQ: '+672',
            HM: '+672',
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
    const [countriesData, setCountriesData] = useState<ICountry[]>([]);
    const [isReady, setReady] = useState(false);
    const locale = localization.locale || 'en';
    const deferredSearch = useDeferredValue(search);

    // Asynchronous loading without UI blocking
    useEffect(() => {
        let canceled = false;

        if (cachedCountries && cachedLocale === locale) {
            setTimeout(() => {
                if (!canceled) {
                    setCountriesData(cachedCountries!);
                    setReady(true);
                }
            }, 0);
            return;
        }

        // Delayed launch so as not to block the transition
        const idle = (globalThis as any).requestIdleCallback || setTimeout;

        const taskId = idle(() => {
            if (canceled) return;

            const displayNames = buildDisplayNames(locale);
            const list = getLocalizedCountries(locale, displayNames).sort((a, b) =>
                a.name.localeCompare(b.name, locale),
            );

            cachedCountries = list;
            cachedLocale = locale;

            setCountriesData(list);
            setReady(true);
        });

        return () => {
            canceled = true;
            if (typeof (globalThis as any).cancelIdleCallback === 'function') {
                (globalThis as any).cancelIdleCallback(taskId);
            } else {
                clearTimeout(taskId);
            }
        };
    }, [locale]);

    const filteredCountries = useMemo(() => {
        const query = deferredSearch.trim().toLocaleLowerCase(locale);
        if (!query) return countriesData;
        return countriesData.filter(country => country.name.toLocaleLowerCase(locale).includes(query));
    }, [deferredSearch, locale, countriesData]);

    const handleSearchChange = useCallback((value: SetStateAction<string>) => {
        setSearch(value);
    }, []);

    return { countriesData: filteredCountries, search, setSearch: handleSearchChange, isReady };
};
