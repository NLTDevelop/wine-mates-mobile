import { config } from '@/config';

const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

const getGoogleApiKey = () => {
    return config.googlePlacesApiKey;
};

export interface IPlaceSuggestion {
    id: string;
    description: string;
}

class LocationService {
    searchCities = async (input: string, language: string = 'en'): Promise<IPlaceSuggestion[]> => {
        const key = getGoogleApiKey();
        if (!key || !input.trim()) {
            console.log('[LocationService] No API key or empty input:', { hasKey: !!key, input });
            return [];
        }

        const params = new URLSearchParams({
            input,
            key,
            language,
            types: '(cities)',
        });

        const response = await fetch(`${GOOGLE_PLACES_BASE_URL}?${params.toString()}`);
        if (!response.ok) {
            console.log('[LocationService] API request failed:', response.status);
            return [];
        }

        const json = await response.json();
        if (!Array.isArray(json.predictions)) {
            console.log('[LocationService] Invalid response format:', json);
            return [];
        }

        const results = json.predictions.map((p: any) => ({
            id: p.place_id,
            description: p.description,
        }));
        console.log('[LocationService] Found cities:', results.length);
        return results;
    };
}

export const locationService = new LocationService();
