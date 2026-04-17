import { config } from '@/config';
import { Platform } from 'react-native';
import { getBundleId } from 'react-native-device-info';
import { IPlaceSuggestion } from './types/IPlaceSuggestion';
import { IRequester, requester } from '@/libs/requester';
import { IPlaceAutocomplete, IPlaceDetails } from './types/IPlaceAutocomplete';

const GOOGLE_PLACES_AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';
const GOOGLE_PLACES_DETAILS_URL = 'https://places.googleapis.com/v1/places';
const GOOGLE_GEOCODE_URL = 'https://geocode.googleapis.com/v4beta/geocode/location';

class LocationService {
    constructor(private _requester: IRequester) {}

    private lastGoogleErrorSignature = '';
    private lastGoogleErrorAt = 0;

    private getAuthHeaders = (fieldMask: string) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': config.googlePlacesApiKey,
            'X-Goog-FieldMask': fieldMask,
            'X-Skip-Auth': 'true',
        };

        if (Platform.OS === 'ios') {
            headers['X-Ios-Bundle-Identifier'] = getBundleId();
        }

        if (Platform.OS === 'android') {
            headers['X-Android-Package'] = getBundleId();
        }

        return headers;
    };

    private normalizeLanguageCode = (language: string) => {
        if (!language?.trim()) {
            return 'en-US';
        }

        const normalized = language.trim().toLowerCase() === 'ua' ? 'uk' : language.trim();
        if (normalized.includes('_')) {
            return normalized.replace('_', '-');
        }

        return normalized;
    };

    private normalizeRegionCode = (language: string) => {
        if (!language?.trim()) {
            return undefined;
        }

        const normalized = language.replace('_', '-');
        const parts = normalized.split('-');
        if (parts.length < 2) {
            return undefined;
        }

        return parts[1].toLowerCase();
    };

    private normalizeCityLabel = (value: string) => {
        const trimmed = (value || '').trim();
        if (!trimmed) {
            return '';
        }

        const [cityName = ''] = trimmed.split(',');
        return cityName.trim();
    };

    private getCountryFromAddressComponents = (addressComponents: any[]) => {
        if (!Array.isArray(addressComponents)) {
            return '';
        }

        const countryComponent = addressComponents.find((component) => {
            const types = component?.types;
            return Array.isArray(types) && types.includes('country');
        });

        if (!countryComponent) {
            return '';
        }

        return (
            countryComponent.longText ||
            countryComponent.long_name ||
            countryComponent.shortText ||
            countryComponent.short_name ||
            ''
        );
    };

    private fetchAutocomplete = async ({
        input,
        language,
        sessionToken,
        includedPrimaryTypes,
        includedRegionCodes,
    }: {
        input: string;
        language: string;
        sessionToken: string;
        includedPrimaryTypes: string[];
        includedRegionCodes?: string[];
    }): Promise<IPlaceSuggestion[]> => {
        if (!config.googlePlacesApiKey) {
            return [];
        }

        const normalizedLanguage = this.normalizeLanguageCode(language);
        const regionCode = this.normalizeRegionCode(normalizedLanguage);
        const body: Record<string, unknown> = {
            input,
            sessionToken,
            languageCode: normalizedLanguage,
            includedPrimaryTypes,
            includeQueryPredictions: false,
        };

        if (regionCode) {
            body.regionCode = regionCode;
        }

        if (includedRegionCodes?.length) {
            body.includedRegionCodes = includedRegionCodes.map(code => code.toUpperCase());
        }

        const response = await this._requester.request({
            method: 'POST',
            url: GOOGLE_PLACES_AUTOCOMPLETE_URL,
            headers: this.getAuthHeaders(
                'suggestions.placePrediction.place,suggestions.placePrediction.placeId,suggestions.placePrediction.text.text',
            ),
            data: body,
        });

        if (response?.isError) {
            const errorPayload = response?.errors || response?.encrypted_error || {};
            const signature = `${response?.status || ''}:${errorPayload?.error?.status || ''}:${errorPayload?.error?.message || response?.message || ''}`;
            const now = Date.now();
            const shouldLog = signature !== this.lastGoogleErrorSignature || now - this.lastGoogleErrorAt > 5000;

            if (shouldLog) {
                this.lastGoogleErrorSignature = signature;
                this.lastGoogleErrorAt = now;
                console.warn(
                    'LocationService -> Google Places error:',
                    response?.status,
                    JSON.stringify(errorPayload || response),
                );
            }
            return [];
        }

        const json = response?.data;
        const suggestions = Array.isArray(json?.suggestions) ? json.suggestions : [];
        if (!suggestions.length) {
            return [];
        }

        const result = suggestions
            .map((item: any) => {
                const prediction = item?.placePrediction;
                const text = prediction?.text?.text;
                const normalizedLabel = this.normalizeCityLabel(text || '');
                const placeId = prediction?.placeId || prediction?.place || normalizedLabel;

                if (!normalizedLabel || !placeId) {
                    return null;
                }

                return {
                    id: placeId,
                    placeId,
                    description: normalizedLabel,
                } as IPlaceSuggestion;
            })
            .filter(Boolean) as IPlaceSuggestion[];

        const uniqueByDescription = new Map<string, IPlaceSuggestion>();
        result.forEach(item => {
            if (!uniqueByDescription.has(item.description)) {
                uniqueByDescription.set(item.description, item);
            }
        });

        const uniqueSuggestions = Array.from(uniqueByDescription.values());
        console.log(
            'LocationService -> Google Places success:',
            JSON.stringify({
                input,
                includedPrimaryTypes,
                includedRegionCodes: includedRegionCodes || [],
                count: uniqueSuggestions.length,
            }),
        );

        return uniqueSuggestions;
    };

    searchCountries = async ({
        input,
        language,
        sessionToken,
    }: {
        input: string;
        language: string;
        sessionToken: string;
    }): Promise<IPlaceSuggestion[]> => {
        const trimmedInput = input.trim();
        if (!trimmedInput) {
            return [];
        }

        try {
            const countriesResult = await this.fetchAutocomplete({
                input: trimmedInput,
                language,
                sessionToken,
                includedPrimaryTypes: ['country'],
            });

            if (countriesResult.length) {
                return countriesResult;
            }

            return await this.fetchAutocomplete({
                input: trimmedInput,
                language,
                sessionToken,
                includedPrimaryTypes: ['(regions)'],
            });
        } catch {
            return [];
        }
    };

    searchCities = async ({
        input,
        countryCode,
        language,
        sessionToken,
    }: {
        input: string;
        countryCode: string;
        language: string;
        sessionToken: string;
    }): Promise<IPlaceSuggestion[]> => {
        const trimmedInput = input.trim();
        if (!trimmedInput || !countryCode) {
            return [];
        }

        try {
            return await this.fetchAutocomplete({
                input: trimmedInput,
                language,
                sessionToken,
                includedPrimaryTypes: ['(cities)'],
                includedRegionCodes: [countryCode],
            });
        } catch {
            return [];
        }
    };

    searchPlaces = async ({
        input,
        language,
        sessionToken,
    }: {
        input: string;
        language: string;
        sessionToken?: string;
    }): Promise<IPlaceAutocomplete[]> => {
        const trimmedInput = input.trim();
        if (!trimmedInput || !config.googlePlacesApiKey) {
            return [];
        }

        try {
            const normalizedLanguage = this.normalizeLanguageCode(language);
            const regionCode = this.normalizeRegionCode(normalizedLanguage);
            const body: Record<string, unknown> = {
                input: trimmedInput,
                languageCode: normalizedLanguage,
                includeQueryPredictions: false,
            };

            if (sessionToken) {
                body.sessionToken = sessionToken;
            }

            if (regionCode) {
                body.regionCode = regionCode;
            }

            const response = await this._requester.request({
                method: 'POST',
                url: GOOGLE_PLACES_AUTOCOMPLETE_URL,
                headers: this.getAuthHeaders(
                    'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text',
                ),
                data: body,
            });

            const suggestions = Array.isArray(response?.data?.suggestions) ? response.data.suggestions : [];
            if (response?.isError || !suggestions.length) {
                return [];
            }

            return suggestions
                .map((item: any) => {
                    const prediction = item?.placePrediction;
                    const description = prediction?.text?.text || '';
                    const placeId = prediction?.placeId || '';

                    if (!placeId || !description) {
                        return null;
                    }

                    return {
                        placeId,
                        description,
                        mainText: prediction?.structuredFormat?.mainText?.text || description,
                        secondaryText: prediction?.structuredFormat?.secondaryText?.text || '',
                    } as IPlaceAutocomplete;
                })
                .filter(Boolean) as IPlaceAutocomplete[];
        } catch {
            return [];
        }
    };

    getPlaceDetails = async ({
        placeId,
        language,
        sessionToken,
    }: {
        placeId: string;
        language: string;
        sessionToken?: string;
    }): Promise<IPlaceDetails | null> => {
        if (!placeId || !config.googlePlacesApiKey) {
            return null;
        }

        try {
            const normalizedLanguage = this.normalizeLanguageCode(language);
            const response = await this._requester.request({
                method: 'GET',
                url: `${GOOGLE_PLACES_DETAILS_URL}/${placeId}`,
                headers: this.getAuthHeaders('id,location,formattedAddress,addressComponents.longText,addressComponents.shortText,addressComponents.types'),
                params: {
                    languageCode: normalizedLanguage,
                    sessionToken,
                },
            });

            const place = response?.data;
            if (response?.isError || !place?.location) {
                return null;
            }

            return {
                latitude: place.location.latitude,
                longitude: place.location.longitude,
                address: place.formattedAddress || '',
                country: this.getCountryFromAddressComponents(place.addressComponents),
            };
        } catch {
            return null;
        }
    };

    reverseGeocode = async ({
        latitude,
        longitude,
        language,
    }: {
        latitude: number;
        longitude: number;
        language: string;
    }): Promise<string | null> => {
        if (!config.googlePlacesApiKey) {
            return null;
        }

        try {
            const normalizedLanguage = this.normalizeLanguageCode(language);
            const response = await this._requester.request({
                method: 'GET',
                url: GOOGLE_GEOCODE_URL,
                headers: this.getAuthHeaders('results.formattedAddress'),
                params: {
                    languageCode: normalizedLanguage,
                    'location.latitude': latitude,
                    'location.longitude': longitude,
                },
            });

            const results = Array.isArray(response?.data?.results) ? response.data.results : [];
            if (response?.isError || !results.length) {
                return null;
            }

            return results[0]?.formattedAddress || null;
        } catch {
            return null;
        }
    };
}

export const locationService = new LocationService(requester);
