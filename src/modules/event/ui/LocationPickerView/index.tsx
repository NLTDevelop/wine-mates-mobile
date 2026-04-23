import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { useLocationPickerView } from './presenters/useLocationPickerView';
import { LocationSearchInput } from './components/LocationSearchInput/ui';
import { MapMarker } from '@/UIKit/MapMarker';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const LocationPickerView = () => {
    const { colors, t } = useUiContext();
    const { top } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, top), [colors, top]);
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
        <ScreenContainer
            edges={['bottom']}
            isKeyboardAvoiding
            scrollEnabled
            headerComponent={
                <HeaderWithBackButton
                    onPressBack={onPressBack}
                    title=""
                    rightComponent={<View style={styles.headerRightPlaceholder} />}
                    containerStyle={styles.headerContainer}
                />
            }
        >
            <View style={styles.container}>
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
                            eventType={eventType}
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
                        disabled={isConfirmDisabled}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
};
