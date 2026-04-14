import { config } from '@/config';
import { Platform } from 'react-native';
import { getBundleId } from 'react-native-device-info';
import { IPlaceSuggestion } from './types/IPlaceSuggestion';
import { IRequester, requester } from '@/libs/requester';

const GOOGLE_PLACES_AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';

class LocationService {
    constructor(private _requester: IRequester) {}

    private lastGoogleErrorSignature = '';
    private lastGoogleErrorAt = 0;

    private getAuthHeaders = () => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': config.googlePlacesApiKey,
            'X-Goog-FieldMask':
                'suggestions.placePrediction.place,suggestions.placePrediction.placeId,suggestions.placePrediction.text.text',
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

        const normalized = language.trim();
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
            headers: this.getAuthHeaders(),
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
}

export const locationService = new LocationService(requester);
