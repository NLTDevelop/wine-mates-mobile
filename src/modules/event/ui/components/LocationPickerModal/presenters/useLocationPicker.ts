import { useCallback, useState, useRef } from 'react';
import { googlePlacesService, IPlaceAutocomplete } from '@/services/location/GooglePlacesService';
import { useUiContext } from '@/UIProvider';
import MapView from 'react-native-maps';

interface IUseLocationPickerProps {
    initialLocation?: { latitude: number; longitude: number } | null;
    onSelectLocation: (latitude: number, longitude: number, label: string, placeName?: string) => void;
    onClose: () => void;
}

export const useLocationPicker = ({ initialLocation, onSelectLocation, onClose }: IUseLocationPickerProps) => {
    const { language } = useUiContext();
    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number; label?: string; placeName?: string } | null>(
        initialLocation || null
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<IPlaceAutocomplete[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mapRef = useRef<MapView>(null);

    const onMapPress = useCallback(async (event: any) => {
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

        const address = await googlePlacesService.reverseGeocode(latitude, longitude, language);

        if (address) {
            setSelectedLocation({
                latitude,
                longitude,
                label: address
            });
            setSearchQuery(address);
        }
    }, [language]);

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
            const results = await googlePlacesService.searchPlaces(text, language);
            setSuggestions(results.slice(0, 3));
            setShowSuggestions(true);
        }, 300);
    }, [language]);

    const onSelectSuggestion = useCallback(async (suggestion: IPlaceAutocomplete) => {
        setSearchQuery(suggestion.mainText);
        setShowSuggestions(false);

        const details = await googlePlacesService.getPlaceDetails(suggestion.placeId);

        if (details) {
            setSelectedLocation({
                latitude: details.latitude,
                longitude: details.longitude,
                label: details.address,
                placeName: suggestion.mainText,
            });
            setSearchQuery(details.address);

            mapRef.current?.animateToRegion({
                latitude: details.latitude,
                longitude: details.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
    }, []);

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

        const address = await googlePlacesService.reverseGeocode(poi.coordinate.latitude, poi.coordinate.longitude, language);

        if (address) {
            setSelectedLocation({
                latitude: poi.coordinate.latitude,
                longitude: poi.coordinate.longitude,
                label: address,
                placeName: poi.name,
            });
            setSearchQuery(address);
        }
    }, [language]);

    const onConfirm = useCallback(() => {
        if (selectedLocation) {
            const label = selectedLocation.label || `${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`;
            onSelectLocation(selectedLocation.latitude, selectedLocation.longitude, label, selectedLocation.placeName);
            onClose();
        }
    }, [selectedLocation, onSelectLocation, onClose]);

    return {
        selectedLocation,
        searchQuery,
        suggestions,
        showSuggestions,
        mapRef,
        onMapPress,
        onPoiClick,
        onSearchChange,
        onSelectSuggestion,
        onConfirm,
    };
};
