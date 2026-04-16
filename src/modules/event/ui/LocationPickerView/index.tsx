import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { useLocationPicker } from './presenters/useLocationPicker';
import { LocationSearchInput } from './components/LocationSearchInput/ui';
import { MapMarker } from '@/UIKit/MapMarker';
import { TastingType } from '@/entities/events/enums/TastingType';
import { RouteProp, StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';

type RouteProps = RouteProp<EventStackParamList, 'LocationPickerView'>;
type NavigationProps = NativeStackNavigationProp<EventStackParamList>;

const KYIV_COORDINATES = {
    latitude: 50.4501,
    longitude: 30.5234,
};

export const LocationPickerView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<RouteProps>();
    const initialLocation = route.params?.initialLocation;
    const tastingType = route.params?.tastingType || TastingType.Tastings;

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
        onSelectLocation: (latitude, longitude, label, placeName) => {
            navigation.dispatch(StackActions.popTo('AddEventView', {
                pickedLocation: {
                    latitude,
                    longitude,
                    label,
                    placeName,
                },
            }));
        },
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
    const headerRightComponent = <View style={styles.headerRightPlaceholder} />;

    return (
        <ScreenContainer edges={['top', 'bottom']} isKeyboardAvoiding scrollEnabled>
            <View style={styles.container}>
                <HeaderWithBackButton
                    onPressBack={navigation.goBack}
                    title=""
                    rightComponent={headerRightComponent}
                    containerStyle={styles.headerContainer}
                />
                <MapView
                    provider={PROVIDER_GOOGLE}
                    showsPointsOfInterests
                    showsUserLocation
                    showsMyLocationButton
                    zoomControlEnabled
                    toolbarEnabled
                    ref={mapRef}
                    onPoiClick={onPoiClick}
                    initialRegion={initialRegion}
                    onPress={onMapPress}
                    scrollEnabled={!isMapInteractionBlocked}
                    zoomEnabled={!isMapInteractionBlocked}
                    style={styles.map}
                >
                    {markerLocation && (
                        <MapMarker
                            markerProps={{
                                coordinate: {
                                    latitude: markerLocation.latitude,
                                    longitude: markerLocation.longitude,
                                },
                            }}
                            eventId={0}
                            tastingType={tastingType}
                        />
                    )}
                </MapView>

                <View style={styles.footer}>
                    <LocationSearchInput
                        value={searchQuery}
                        onChangeText={onSearchChange}
                        suggestions={suggestions}
                        onSelectSuggestion={onSelectSuggestion}
                        showSuggestions={showSuggestions}
                    />
                    {selectedLocation?.label && (
                        <Typography text={selectedLocation.label} variant="body_400" style={styles.addressText} />
                    )}
                    <Button
                        text={t('event.confirmPlace')}
                        onPress={onConfirm}
                        type="main"
                        disabled={!(selectedLocation || initialLocation || userLocation)}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
};
