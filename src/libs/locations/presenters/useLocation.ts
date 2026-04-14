import { useCallback, useRef, useState } from 'react';
import { locationService } from '@/libs/locations/LocationService';
import { IPlaceSuggestion } from '@/libs/locations/types/IPlaceSuggestion';
import { useUiContext } from '@/UIProvider';

const CITY_SEARCH_DEBOUNCE_MS = 300;

const createSessionToken = () => {
    const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

    return template.replace(/[xy]/g, char => {
        const random = Math.floor(Math.random() * 16);
        const value = char === 'x' ? random : ((random % 4) + 8);
        return value.toString(16);
    });
};

export const useLocation = () => {
    const { locale } = useUiContext();
    const [citySuggestions, setCitySuggestions] = useState<IPlaceSuggestion[]>([]);
    const [isCityLoading, setIsCityLoading] = useState(false);

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const citySessionTokenRef = useRef<string | null>(null);
    const cityRequestIdRef = useRef(0);
    const currentCountryRef = useRef<string>('');
    const lastSearchQueryRef = useRef('');
    const lastSearchCountryRef = useRef('');

    const getCitySessionToken = useCallback(() => {
        if (!citySessionTokenRef.current) {
            citySessionTokenRef.current = createSessionToken();
        }

        return citySessionTokenRef.current;
    }, []);

    const resetCitySession = useCallback(() => {
        citySessionTokenRef.current = null;
    }, []);

    const clearCitySuggestions = useCallback(() => {
        cityRequestIdRef.current += 1;
        setCitySuggestions([]);
        setIsCityLoading(false);
        lastSearchQueryRef.current = '';
        lastSearchCountryRef.current = '';

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = null;
        }

        resetCitySession();
    }, [resetCitySession]);

    const onCountryChanged = useCallback((countryCode: string) => {
        const normalizedCountry = (countryCode || '').trim().toUpperCase();

        if (currentCountryRef.current !== normalizedCountry) {
            currentCountryRef.current = normalizedCountry;
            clearCitySuggestions();
        }
    }, [clearCitySuggestions]);

    const onSelectCity = useCallback(() => {
        resetCitySession();
    }, [resetCitySession]);

    const searchCities = useCallback((query: string, countryCode: string) => {
        const normalizedCountry = (countryCode || '').trim().toUpperCase();
        const trimmedQuery = query.trim();
        const normalizedQuery = trimmedQuery.toLowerCase();

        if (!normalizedCountry) {
            clearCitySuggestions();
            return;
        }

        if (currentCountryRef.current !== normalizedCountry) {
            currentCountryRef.current = normalizedCountry;
            clearCitySuggestions();
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!trimmedQuery) {
            setCitySuggestions([]);
            setIsCityLoading(false);
            resetCitySession();
            lastSearchQueryRef.current = '';
            lastSearchCountryRef.current = '';
            return;
        }

        const isSameRequest =
            lastSearchQueryRef.current === normalizedQuery &&
            lastSearchCountryRef.current === normalizedCountry;

        if (isSameRequest) {
            return;
        }

        lastSearchQueryRef.current = normalizedQuery;
        lastSearchCountryRef.current = normalizedCountry;

        searchTimeoutRef.current = setTimeout(async () => {
            const requestId = cityRequestIdRef.current + 1;
            cityRequestIdRef.current = requestId;

            try {
                setIsCityLoading(true);
                const token = getCitySessionToken();
                const result = await locationService.searchCities({
                    input: trimmedQuery,
                    countryCode: normalizedCountry,
                    language: locale,
                    sessionToken: token,
                });

                if (cityRequestIdRef.current === requestId) {
                    setCitySuggestions(result);
                }
            } catch {
                if (cityRequestIdRef.current === requestId) {
                    setCitySuggestions([]);
                }
            } finally {
                if (cityRequestIdRef.current === requestId) {
                    setIsCityLoading(false);
                }
            }
        }, CITY_SEARCH_DEBOUNCE_MS);
    }, [clearCitySuggestions, getCitySessionToken, locale, resetCitySession]);

    return {
        citySuggestions,
        isCityLoading,
        searchCities,
        onCountryChanged,
        onSelectCity,
        clearCitySuggestions,
    };
};
