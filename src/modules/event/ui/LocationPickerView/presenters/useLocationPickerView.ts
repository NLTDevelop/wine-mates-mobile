import { useCallback, useMemo } from 'react';
import { EventType } from '@/entities/events/enums/EventType';
import { useLocationPicker } from './useLocationPicker';
import { RouteProp, StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';

type RouteProps = RouteProp<EventStackParamList, 'LocationPickerView'>;
type NavigationProps = NativeStackNavigationProp<EventStackParamList>;

const KYIV_COORDINATES = {
    latitude: 50.4501,
    longitude: 30.5234,
};

export const useLocationPickerView = () => {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<RouteProps>();
    const initialLocation = route.params?.initialLocation;
    const eventType = route.params?.eventType || EventType.Tastings;

    const onSelectLocation = useCallback((
        latitude: number,
        longitude: number,
        label: string,
        placeName?: string,
        countryName?: string,
    ) => {
        navigation.dispatch(
            StackActions.popTo('AddEventView', {
                pickedLocation: {
                    latitude,
                    longitude,
                    label,
                    placeName,
                    countryName,
                },
            }),
        );
    }, [navigation]);

    const {
        selectedLocation,
        userLocation,
        searchQuery,
        suggestions,
        showSuggestions,
        isMapInteractionBlocked,
        mapRef,
        onMapPress,
        onPoiClick,
        onSearchChange,
        onSelectSuggestion,
        onConfirm,
    } = useLocationPicker({
        initialLocation,
        onSelectLocation,
        onClose: () => null,
    });

    const initialRegion = useMemo(() => {
        const location = selectedLocation || initialLocation || userLocation || KYIV_COORDINATES;

        return {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
    }, [initialLocation, selectedLocation, userLocation]);

    const markerLocation = selectedLocation || initialLocation;
    const isConfirmDisabled = !(selectedLocation || initialLocation);

    return {
        eventType,
        selectedLocation,
        searchQuery,
        suggestions,
        showSuggestions,
        isMapInteractionBlocked,
        mapRef,
        initialRegion,
        markerLocation,
        isConfirmDisabled,
        onMapPress,
        onPoiClick,
        onSearchChange,
        onSelectSuggestion,
        onConfirm,
        onPressBack: navigation.goBack,
    };
};
