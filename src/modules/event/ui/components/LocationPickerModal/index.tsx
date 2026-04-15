import { useMemo } from 'react';
import { Modal, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import MapView from 'react-native-maps';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocationPicker } from './presenters/useLocationPicker';
import { RoundedButton } from '@/UIKit/TitledContent/components/RoundedButton';
import { LocationSearchInput } from './components/LocationSearchInput/ui';
import { MapMarker } from '@/UIKit/MapMarker';
import { TastingType } from '@/entities/events/enums/TastingType';

interface IProps {
    visible: boolean;
    onClose: () => void;
    onSelectLocation: (latitude: number, longitude: number, label: string, placeName?: string) => void;
    initialLocation?: { latitude: number; longitude: number } | null;
    tastingType?: TastingType;
}

export const LocationPickerModal = ({ visible, onClose, onSelectLocation, initialLocation, tastingType = TastingType.Tastings }: IProps) => {
    const { top } = useSafeAreaInsets();
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors, top), [colors, top]);

    const {
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
    } = useLocationPicker({
        initialLocation,
        onSelectLocation,
        onClose,
    });


    return (
        <Modal
            visible={visible}
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <RoundedButton
                        onPress={onClose}
                        isArrowLeft
                    />
                </View>

                <MapView
                    provider="google"
                    showsPointsOfInterests
                    ref={mapRef}
                    onPoiClick={onPoiClick}
                    initialRegion={{
                        latitude: selectedLocation?.latitude || 50.4501,
                        longitude: selectedLocation?.longitude || 30.5234,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onPress={onMapPress}
                    style={styles.map}
                >
                    {selectedLocation && (
                        <MapMarker
                            markerProps={{
                                coordinate: {
                                    latitude: selectedLocation.latitude,
                                    longitude: selectedLocation.longitude,
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
                        <Typography
                            text={selectedLocation.label}
                            variant="body_400"
                            style={styles.addressText}
                        />
                    )}
                    <Button
                        text={t('common.confirm')}
                        onPress={onConfirm}
                        type="main"
                        disabled={!selectedLocation}
                    />
                </View>
            </View>
        </Modal>
    );
};
