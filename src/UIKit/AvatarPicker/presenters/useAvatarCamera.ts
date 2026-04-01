import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useAppState } from '@react-native-community/hooks';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';
import { Camera, PhotoFile, TakePhotoOptions, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useUiContext } from '@/UIProvider';
import { isAndroid } from '@/utils';

interface IAvatarImage {
    uri: string;
    name: string;
    type: string;
}

type CameraPosition = 'front' | 'back';

export const useAvatarCamera = (targetSize: number) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { colors } = useUiContext();
    const appState = useAppState();
    const isFocused = useIsFocused();
    const cameraRef = useRef<Camera>(null);
    const [cameraPosition, setCameraPosition] = useState<CameraPosition>('front');
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice(cameraPosition);
    const backDevice = useCameraDevice('back');
    const frontDevice = useCameraDevice('front');

    const cropperConfig = useMemo(() => ({
        width: Math.round(targetSize),
        height: Math.round(targetSize),
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo' as const,
        compressImageQuality: 1,
        ...(isAndroid && {
            cropperToolbarColor: colors.background,
            cropperActiveWidgetColor: colors.primary,
            cropperStatusBarColor: colors.background,
            cropperToolbarWidgetColor: colors.text,
        }),
    }), [targetSize, colors]);

    const prepareImage = async ({ uri, name, type, width, height, shouldResize, rotation }: { uri: string; name?: string | null; type?: string | null; width?: number; height?: number; shouldResize?: boolean; rotation?: number }): Promise<IAvatarImage> => {
        const normalizedUri = uri.startsWith('file://') ? uri : `file://${uri}`;
        const uriName = normalizedUri.split('/').pop();

        if (shouldResize && width && height) {
            try {
                if (ImageResizer?.createResizedImage) {
                    const resized = await ImageResizer.createResizedImage(
                        normalizedUri,
                        width,
                        height,
                        'JPEG',
                        100,
                        rotation || 0,
                    );

                    return {
                        uri: resized.uri,
                        name: name || uriName || `avatar-${Date.now()}.jpg`,
                        type: type || 'image/jpeg',
                    };
                }
            } catch (error) {
                console.error('Error resizing image:', error);
            }
        }

        return {
            uri: normalizedUri,
            name: name || uriName || `avatar-${Date.now()}.jpg`,
            type: type || 'image/jpeg',
        };
    };

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    const onGalleryPress = async () => {
        try {
            const image = await ImageCropPicker.openPicker(cropperConfig);

            const normalizedUri = image.path.startsWith('file://') ? image.path : `file://${image.path}`;
            const avatarImage: IAvatarImage = {
                uri: normalizedUri,
                name: image.path.split('/').pop() || `avatar-${Date.now()}.jpg`,
                type: image.mime || 'image/jpeg',
            };

            navigation.goBack();
            setTimeout(() => {
                navigation.navigate('ProfileSettingsView', { selectedAvatar: avatarImage });
            }, 0);
        } catch (error) {
            console.log('User cancelled image picker or error:', error);
        }
    };

    const onTakePhotoPress = async () => {
        try {
            const options: TakePhotoOptions & { qualityPrioritization?: 'speed' | 'balanced' | 'quality' } = {
                flash: 'off',
                qualityPrioritization: 'quality',
            };

            const photo = await cameraRef.current?.takePhoto(options);

            if (photo?.path) {
                const photoPath = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
                
                const croppedImage = await ImageCropPicker.openCropper({
                    path: photoPath,
                    ...cropperConfig,
                });

                const normalizedUri = croppedImage.path.startsWith('file://') ? croppedImage.path : `file://${croppedImage.path}`;
                const avatarImage: IAvatarImage = {
                    uri: normalizedUri,
                    name: croppedImage.path.split('/').pop() || `avatar-${Date.now()}.jpg`,
                    type: croppedImage.mime || 'image/jpeg',
                };

                navigation.goBack();
                setTimeout(() => {
                    navigation.navigate('ProfileSettingsView', { selectedAvatar: avatarImage });
                }, 0);
            }
        } catch (error) {
            console.error('Error taking photo or cropping:', error);
        }
    };

    const onCrossPress = () => {
        navigation.goBack();
    };

    const onSwitchCamera = useCallback(() => {
        setCameraPosition(prev => prev === 'front' ? 'back' : 'front');
    }, []);

    return {
        appState,
        onGalleryPress,
        onTakePhotoPress,
        onCrossPress,
        onSwitchCamera,
        cameraRef,
        device,
        hasPermission,
        hasBothCameras: !!frontDevice && !!backDevice,
    };
};
