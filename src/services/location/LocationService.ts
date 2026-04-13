const COUNTRIES_NOW_BASE_URL = 'https://countriesnow.space/api/v0.1/countries/cities';

export interface IPlaceSuggestion {
    id: string;
    description: string;
}

class LocationService {
    searchCities = async (input: string, country: string, language: string = 'en'): Promise<IPlaceSuggestion[]> => {
        
        if (!country) {
            return [];
        }

        const response = await fetch(COUNTRIES_NOW_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': language,
            },
            body: JSON.stringify({
                country,
                language,
            }),
        });

        if (!response.ok) {
            return [];
        }

        const json = await response.json();
        
        if (!Array.isArray(json.data)) {
            return [];
        }

        const trimmedInput = input.trim();
        let filteredCities = json.data;

        if (trimmedInput) {
            const lowerInput = trimmedInput.toLowerCase();
            filteredCities = json.data.filter((city: string) =>
                city.toLowerCase().includes(lowerInput)
            );
        }

        const results = filteredCities.map((city: string) => ({
            id: city,
            description: city,
        }));

        return results;
    };
}

export const locationService = new LocationService();
