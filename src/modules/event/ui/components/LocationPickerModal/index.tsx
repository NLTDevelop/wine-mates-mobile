import { useMemo } from 'react';
import { Modal, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { MapView } from '@/UIKit/MapView';
import { Marker } from 'react-native-maps';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocationPicker } from './presenters/useLocationPicker';
import { RoundedButton } from '@/UIKit/TitledContent/components/RoundedButton';

interface IProps {
    visible: boolean;
    onClose: () => void;
    onSelectLocation: (latitude: number, longitude: number) => void;
    initialLocation?: { latitude: number; longitude: number } | null;
}

export const LocationPickerModal = ({ visible, onClose, onSelectLocation, initialLocation }: IProps) => {
    const { top } = useSafeAreaInsets();
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors, top), [colors, top]);

    const { selectedLocation, onMapPress, onConfirm } = useLocationPicker({
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
                        <Marker
                            coordinate={{
                                latitude: selectedLocation.latitude,
                                longitude: selectedLocation.longitude,
                            }}
                        />
                    )}
                </MapView>

                <View style={styles.footer}>
                    {selectedLocation && (
                        <Typography
                            text={`${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`}
                            variant="body_400"
                            style={styles.coordinates}
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
