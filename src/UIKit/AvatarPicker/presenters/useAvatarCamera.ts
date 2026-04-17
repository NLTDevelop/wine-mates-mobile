import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useAppState } from '@react-native-community/hooks';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, TakePhotoOptions, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
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
    useIsFocused();
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
                navigation.navigate('EditProfileDetailsView', { selectedAvatar: avatarImage });
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
                    navigation.navigate('EditProfileDetailsView', { selectedAvatar: avatarImage });
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
