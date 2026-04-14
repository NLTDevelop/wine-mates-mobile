import { config } from '@/config';

export interface IPlaceAutocomplete {
    placeId: string;
    description: string;
    mainText: string;
    secondaryText: string;
}

export interface IPlaceDetails {
    latitude: number;
    longitude: number;
    address: string;
}

class GooglePlacesService {
    private apiKey = config.googlePlacesApiKey;
    private autocompleteBaseUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    private detailsBaseUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
    private geocodeBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

    searchPlaces = async (input: string, language: string = 'en'): Promise<IPlaceAutocomplete[]> => {
        if (!input.trim()) {
            return [];
        }

        try {
            const url = `${this.autocompleteBaseUrl}?input=${encodeURIComponent(input)}&key=${this.apiKey}&language=${language}`;
            const response = await fetch(url);

            if (!response.ok) {
                return [];
            }

            const data = await response.json();

            if (data.status !== 'OK' || !Array.isArray(data.predictions)) {
                return [];
            }

            return data.predictions.map((prediction: any) => ({
                placeId: prediction.place_id,
                description: prediction.description,
                mainText: prediction.structured_formatting?.main_text || prediction.description,
                secondaryText: prediction.structured_formatting?.secondary_text || '',
            }));
        } catch (error) {
            console.error('Error searching places:', error);
            return [];
        }
    };

    getPlaceDetails = async (placeId: string): Promise<IPlaceDetails | null> => {
        try {
            const url = `${this.detailsBaseUrl}?place_id=${placeId}&key=${this.apiKey}&fields=geometry,formatted_address`;
            const response = await fetch(url);

            if (!response.ok) {
                return null;
            }

            const data = await response.json();

            if (data.status !== 'OK' || !data.result) {
                return null;
            }

            const { geometry, formatted_address } = data.result;

            return {
                latitude: geometry.location.lat,
                longitude: geometry.location.lng,
                address: formatted_address,
            };
        } catch (error) {
            console.error('Error getting place details:', error);
            return null;
        }
    };

    reverseGeocode = async (latitude: number, longitude: number, language: string = 'en'): Promise<string | null> => {
        try {
            const url = `${this.geocodeBaseUrl}?latlng=${latitude},${longitude}&key=${this.apiKey}&language=${language}`;
            const response = await fetch(url);

            if (!response.ok) {
                return null;
            }

            const data = await response.json();

            if (data.status !== 'OK' || !data.results || data.results.length === 0) {
                return null;
            }

            return data.results[0].formatted_address;
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            return null;
        }
    };
}

export const googlePlacesService = new GooglePlacesService();
