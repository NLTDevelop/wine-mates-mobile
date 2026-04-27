import { useCallback, useEffect, useState, useRef } from 'react';
import { locationService } from '@/libs/locations/LocationService';
import { IPlaceAutocomplete } from '@/libs/locations/types/IPlaceAutocomplete';
import { useUiContext } from '@/UIProvider';
import MapView from 'react-native-maps';
import { useLocationPermission } from '@/hooks/useLocationPermission';

interface IUseLocationPickerProps {
    initialLocation?: { latitude: number; longitude: number } | null;
    onSelectLocation: (latitude: number, longitude: number, label: string, placeName?: string, countryName?: string) => void;
    onClose: () => void;
}

const createSessionToken = () => {
    const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

    return template.replace(/[xy]/g, char => {
        const random = Math.floor(Math.random() * 16);
        const value = char === 'x' ? random : ((random % 4) + 8);
        return value.toString(16);
    });
};

export const useLocationPicker = ({ initialLocation, onSelectLocation, onClose }: IUseLocationPickerProps) => {
    const { language } = useUiContext();
    const { userLocation } = useLocationPermission();
    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number; label?: string; placeName?: string; countryName?: string } | null>(
        initialLocation || null
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<IPlaceAutocomplete[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSuggestionSelectionInProgress, setIsSuggestionSelectionInProgress] = useState(false);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sessionTokenRef = useRef<string>(createSessionToken());
    const mapRef = useRef<MapView>(null);

    const getCountryFromAddress = useCallback((address?: string) => {
        if (!address) {
            return '';
        }

        const parts = address
            .split(',')
            .map(part => part.trim())
            .filter(Boolean);

        return parts[parts.length - 1] || '';
    }, []);

    useEffect(() => {
        if (selectedLocation) {
            mapRef.current?.animateToRegion({
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 500);
            return;
        }

        if (!initialLocation && userLocation) {
            mapRef.current?.animateToRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 500);
        }
    }, [initialLocation, selectedLocation, userLocation]);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [language]);

    const onMapPress = useCallback(async (event: any) => {
        if (showSuggestions || isSuggestionSelectionInProgress) {
            return;
        }

        const { latitude, longitude } = event.nativeEvent.coordinate;

        const coordsText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

        setSelectedLocation({
            latitude,
            longitude,
            label: ''
        });
        setSearchQuery(coordsText);
        setShowSuggestions(false);

        mapRef.current?.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 500);

        const address = await locationService.reverseGeocode({
            latitude,
            longitude,
            language,
        });

        if (address) {
            setSelectedLocation({
                latitude,
                longitude,
                label: address,
                countryName: getCountryFromAddress(address),
            });
            setSearchQuery(address);
        }
    }, [getCountryFromAddress, isSuggestionSelectionInProgress, language, showSuggestions]);

    const onSearchChange = useCallback((text: string) => {
        setSearchQuery(text);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!text.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        searchTimeoutRef.current = setTimeout(async () => {
            const results = await locationService.searchPlaces({
                input: text,
                language,
                sessionToken: sessionTokenRef.current,
            });
            setSuggestions(results.slice(0, 3));
            setShowSuggestions(true);
        }, 300);
    }, [language]);

    const onSelectSuggestion = useCallback(async (suggestion: IPlaceAutocomplete) => {
        setIsSuggestionSelectionInProgress(true);
        setSearchQuery(suggestion.mainText);
        setShowSuggestions(false);

        try {
            const details = await locationService.getPlaceDetails({
                placeId: suggestion.placeId,
                language,
                sessionToken: sessionTokenRef.current,
            });

            if (details) {
                const localizedAddress = await locationService.reverseGeocode({
                    latitude: details.latitude,
                    longitude: details.longitude,
                    language,
                });
                const address = localizedAddress || details.address;

                setSelectedLocation({
                    latitude: details.latitude,
                    longitude: details.longitude,
                    label: address,
                    placeName: suggestion.mainText,
                    countryName: details.country || getCountryFromAddress(address),
                });
                setSearchQuery(address);

                mapRef.current?.animateToRegion({
                    latitude: details.latitude,
                    longitude: details.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }, 1000);
            }
        } finally {
            setTimeout(() => {
                setIsSuggestionSelectionInProgress(false);
            }, 250);
        }
    }, [getCountryFromAddress, language]);

    const onPoiClick = useCallback(async (event: any) => {
        const poi = event.nativeEvent;

        setSelectedLocation({
            latitude: poi.coordinate.latitude,
            longitude: poi.coordinate.longitude,
            label: '',
            placeName: poi.name,
        });
        setSearchQuery(poi.name);
        setShowSuggestions(false);

        mapRef.current?.animateToRegion({
            latitude: poi.coordinate.latitude,
            longitude: poi.coordinate.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 500);

        const address = await locationService.reverseGeocode({
            latitude: poi.coordinate.latitude,
            longitude: poi.coordinate.longitude,
            language,
        });

        if (address) {
            setSelectedLocation({
                latitude: poi.coordinate.latitude,
                longitude: poi.coordinate.longitude,
                label: address,
                placeName: poi.name,
                countryName: getCountryFromAddress(address),
            });
            setSearchQuery(address);
        }
    }, [getCountryFromAddress, language]);

    const onConfirm = useCallback(() => {
        const locationToConfirm = selectedLocation || initialLocation;

        if (locationToConfirm) {
            const label = selectedLocation?.label || `${locationToConfirm.latitude.toFixed(4)}, ${locationToConfirm.longitude.toFixed(4)}`;
            onSelectLocation(
                locationToConfirm.latitude,
                locationToConfirm.longitude,
                label,
                selectedLocation?.placeName,
                selectedLocation?.countryName || getCountryFromAddress(label),
            );
            sessionTokenRef.current = createSessionToken();
            onClose();
        }
    }, [getCountryFromAddress, initialLocation, onClose, onSelectLocation, selectedLocation]);

    return {
        selectedLocation,
        userLocation,
        searchQuery,
        suggestions,
        showSuggestions,
        isMapInteractionBlocked: showSuggestions || isSuggestionSelectionInProgress,
        mapRef,
        onMapPress,
        onPoiClick,
        onSearchChange,
        onSelectSuggestion,
        onConfirm,
    };
};
