import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { useLocationPickerView } from './presenters/useLocationPickerView';
import { LocationSearchInput } from './components/LocationSearchInput/ui';
import { MapMarker } from '@/UIKit/MapMarker';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { ArrowIcon } from '@assets/icons/ArrowIcon';

export const LocationPickerView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
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
        onPressBack,
    } = useLocationPickerView();

    return (
        <ScreenContainer edges={['top', 'bottom']} isKeyboardAvoiding scrollEnabled>
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    showsPointsOfInterests
                    showsUserLocation
                    showsMyLocationButton
                    userInterfaceStyle="light"
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
                            eventType={eventType}
                        />
                    )}
                </MapView>

                <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
                    <ArrowIcon width={20} height={20} />
                </TouchableOpacity>

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
                        disabled={isConfirmDisabled}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
};
