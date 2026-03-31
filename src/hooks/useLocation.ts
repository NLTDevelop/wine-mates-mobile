import { useCallback, useRef, useState } from 'react';
import { locationService, IPlaceSuggestion } from '@/services/location/LocationService';
import { useUiContext } from '@/UIProvider';

const CITY_SEARCH_DEBOUNCE_MS = 300;

export const useLocation = () => {
    const { locale } = useUiContext();
    const [citySuggestions, setCitySuggestions] = useState<IPlaceSuggestion[]>([]);
    const [isCityLoading, setIsCityLoading] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const searchCities = useCallback((query: string) => {
        const trimmed = query.trim();
        console.log('[useLocation] searchCities called:', query);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!trimmed) {
            setCitySuggestions([]);
            return;
        }

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                setIsCityLoading(true);
                console.log('[useLocation] Calling API for:', trimmed);
                const results = await locationService.searchCities(trimmed, locale);
                console.log('[useLocation] Got results:', results.length);
                setCitySuggestions(results);
            } catch (error) {
                console.log('[useLocation] Error:', error);
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
