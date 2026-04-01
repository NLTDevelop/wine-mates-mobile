import { useMemo } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { Camera } from 'react-native-vision-camera';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { GalleryIcon } from '@assets/icons/GalleryIcon';
import { SwitchCameraIcon } from '@assets/icons/SwitchCameraIcon';
import { useUiContext } from '@/UIProvider';
import { useAvatarCamera } from '../../presenters/useAvatarCamera';
import { getStyles } from './styles';
import { CameraMask } from './components/CameraMask';

const { width: screenWidth } = Dimensions.get('window');
const CIRCLE_SIZE = screenWidth * 0.9;

export const AvatarCameraView = () => {
    const { colors } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, top, bottom), [colors, top, bottom]);
    const isFocused = useIsFocused();

    const { appState, onGalleryPress, onTakePhotoPress, onCrossPress, onSwitchCamera, cameraRef, device, hasPermission, hasBothCameras } = useAvatarCamera(CIRCLE_SIZE);

    return (
        <View style={styles.container}>
            {!hasPermission || !device ? null : (
                <>
                    <Camera
                        ref={cameraRef}
                        isActive={isFocused && appState === 'active'}
                        device={device}
                        photo
                        style={StyleSheet.absoluteFill}
                    />
                    <CameraMask circleSize={CIRCLE_SIZE} />
                    <View style={styles.topBar}>
                        <TouchableOpacity onPress={onCrossPress} style={styles.button}>
                            <CrossIcon color={colors.icon} width={20} height={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomBar}>
                        <TouchableOpacity onPress={onGalleryPress} style={styles.bottomButtons}>
                            <GalleryIcon color={colors.icon} width={24} height={24} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onTakePhotoPress} style={styles.mainShotButton}>
                            <View style={styles.mainShotInner} />
                        </TouchableOpacity>

                        {hasBothCameras ? (
                            <TouchableOpacity onPress={onSwitchCamera} style={styles.bottomButtons}>
                                <SwitchCameraIcon color={colors.icon} width={24} height={24} />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.bottomButtons} />
                        )}
                    </View>
                </>
            )}
        </View>
    );
};
