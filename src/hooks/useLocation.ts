import { useCallback, useRef, useState } from 'react';
import { locationService, IPlaceSuggestion } from '@/services/location/LocationService';
import { useUiContext } from '@/UIProvider';

const CITY_SEARCH_DEBOUNCE_MS = 300;

export const useLocation = () => {
    const { locale } = useUiContext();
    const [citySuggestions, setCitySuggestions] = useState<IPlaceSuggestion[]>([]);
    const [isCityLoading, setIsCityLoading] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const searchCities = useCallback((query: string, country: string) => {
        const trimmed = query.trim();

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!country) {
            setCitySuggestions([]);
            return;
        }

        if (!trimmed && query !== '') {
            setCitySuggestions([]);
            return;
        }

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                setIsCityLoading(true);
                const results = await locationService.searchCities(query, country, locale);
                setCitySuggestions(results);
            } catch (error) {
                setCitySuggestions([]);
            } finally {
                setIsCityLoading(false);
            }
        }, CITY_SEARCH_DEBOUNCE_MS);
    }, [locale]);

    const clearCitySuggestions = useCallback(() => {
        setCitySuggestions([]);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = null;
        }
    }, []);

    return {
        citySuggestions,
        isCityLoading,
        searchCities,
        clearCitySuggestions,
    };
};
