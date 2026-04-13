import countries from 'world-countries';
const COUNTRIES_NOW_BASE_URL = 'https://countriesnow.space/api/v0.1/countries/cities';

export interface IPlaceSuggestion {
    id: string;
    description: string;
}

class LocationService {
    private normalizeLanguage = (language: string) => {
        if (!language) {
            return 'en';
        }

        const normalized = language.toLowerCase();
        if (normalized.includes('-')) {
            return normalized.split('-')[0];
        }

        return normalized;
    };

    private resolveCountryForCountriesNow = (country: string) => {
        if (!country) {
            return '';
        }

        if (country.length === 2) {
            const byCode = countries.find(item => item.cca2?.toLowerCase() === country.toLowerCase());
            return byCode?.name?.common || country;
        }

        return country;
    };

    private fetchCities = async (country: string, language: string): Promise<string[]> => {
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

        return json.data;
    };

    searchCities = async (input: string, country: string, language: string = 'en'): Promise<IPlaceSuggestion[]> => {
        if (!country) {
            return [];
        }

        const trimmedInput = input.trim();
        const countryNameForCountriesNow = this.resolveCountryForCountriesNow(country);
        const normalizedLanguage = this.normalizeLanguage(language);

        let cities: string[] = [];
        try {
            cities = await this.fetchCities(countryNameForCountriesNow, normalizedLanguage);
            if (!cities.length && normalizedLanguage !== 'en') {
                cities = await this.fetchCities(countryNameForCountriesNow, 'en');
            }
        } catch {
            return [];
        }

        let filteredCities = cities;
        if (trimmedInput) {
            const lowerInput = trimmedInput.toLowerCase();
            filteredCities = cities.filter((city: string) => city.toLowerCase().includes(lowerInput));
        }

        return filteredCities.map((city: string) => ({
            id: city,
            description: city,
        }));
    };
}

export const locationService = new LocationService();
