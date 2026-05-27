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

    const getLocationDetails = useCallback(
        async (latitude: number, longitude: number) => {
            const details = await locationService.reverseGeocodeDetails({
                latitude,
                longitude,
                language,
            });

            const address = details?.address || '';

            return {
                address,
                countryCode: details?.countryCode || '',
            };
        },
        [language],
    );

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

        const details = await getLocationDetails(latitude, longitude);

        if (details.address) {
            setSelectedLocation({
                latitude,
                longitude,
                label: details.address,
                countryName: details.countryCode,
            });
            setSearchQuery(details.address);
        }
    }, [getLocationDetails, isSuggestionSelectionInProgress, showSuggestions]);

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
                sessionToken: sessionTokenRef.current,
            });

            if (details) {
                const localizedDetails = await locationService.reverseGeocodeDetails({
                    latitude: details.latitude,
                    longitude: details.longitude,
                    language,
                });
                const address = localizedDetails?.address || details.address;
                const countryCode = details.countryCode || localizedDetails?.countryCode || '';

                setSelectedLocation({
                    latitude: details.latitude,
                    longitude: details.longitude,
                    label: address,
                    placeName: suggestion.mainText,
                    countryName: countryCode,
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
    }, [language]);

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

        const details = await getLocationDetails(poi.coordinate.latitude, poi.coordinate.longitude);

        if (details.address) {
            setSelectedLocation({
                latitude: poi.coordinate.latitude,
                longitude: poi.coordinate.longitude,
                label: details.address,
                placeName: poi.name,
                countryName: details.countryCode,
            });
            setSearchQuery(details.address);
        }
    }, [getLocationDetails]);

    const onConfirm = useCallback(async () => {
        const locationToConfirm = selectedLocation || initialLocation;

        if (locationToConfirm) {
            const fallbackLabel = `${locationToConfirm.latitude.toFixed(4)}, ${locationToConfirm.longitude.toFixed(4)}`;
            const resolvedDetails = selectedLocation?.countryName
                ? null
                : await getLocationDetails(locationToConfirm.latitude, locationToConfirm.longitude);
            const label = selectedLocation?.label || resolvedDetails?.address || fallbackLabel;
            const countryName = selectedLocation?.countryName || resolvedDetails?.countryCode || '';
            onSelectLocation(
                locationToConfirm.latitude,
                locationToConfirm.longitude,
                label,
                selectedLocation?.placeName,
                countryName,
            );
            sessionTokenRef.current = createSessionToken();
            onClose();
        }
    }, [getLocationDetails, initialLocation, onClose, onSelectLocation, selectedLocation]);

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
