import { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera } from 'react-native-vision-camera';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { FlashActiveIcon } from '@assets/icons/FlashActiveIcon';
import { FlashInactiveIcon } from '@assets/icons/FlashInactiveIcon';
import { GalleryIcon } from '@assets/icons/GalleryIcon';
import { AddFileIcon } from '@assets/icons/AddFileIcon';
import { useUiContext } from '@/UIProvider';
import { useScanner } from '../../presenters/useScanner';
import { getStyles } from './styles';

export const ScannerView = () => {
    const { colors } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, top, bottom), [colors, top, bottom]);
    const { torch, onGalleryPress, onTakePhotoPress, onCrossPress, onCreatePress, onTorchPress,
        device, cameraOutputs, isCameraActive, torchMode, hasPermission } = useScanner();

    return (
        <View style={styles.container}>
            {!hasPermission || !device ? null : (
                <>
                    <Camera
                        isActive={isCameraActive}
                        device={device}
                        outputs={cameraOutputs}
                        torchMode={torchMode}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.topBar}>
                        <TouchableOpacity onPress={onCrossPress} style={styles.button}>
                            <CrossIcon color={colors.icon} width={20} height={20} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onTorchPress} style={styles.button}>
                            {torch === 'on' ? (
                                <FlashActiveIcon color={colors.icon} width={20} height={20} />
                            ) : (
                                <FlashInactiveIcon color={colors.icon} width={20} height={20} />
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomBar}>
                        <TouchableOpacity onPress={onGalleryPress} style={styles.bottomButtons}>
                            <GalleryIcon color={colors.icon} width={24} height={24} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onTakePhotoPress} style={styles.mainShotButton}>
                            <View style={styles.mainShotInner} />
                        </TouchableOpacity>
                      
                        <TouchableOpacity onPress={onCreatePress} style={styles.bottomButtons}>
                            <AddFileIcon color={colors.icon} width={24} height={24} />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};
