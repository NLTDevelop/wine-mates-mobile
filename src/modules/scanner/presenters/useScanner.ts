import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppState } from '@react-native-community/hooks';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';
import { Camera, PhotoFile, TakePhotoOptions, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
import { IWineImage } from '@/entities/wine/types/IWineImage';
import { wineModel } from '@/entities/wine/WineModel';
import { isAndroid } from '@/utils';

export const useScanner = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const appState = useAppState();
    const isFocused = useIsFocused();
    const cameraRef = useRef<Camera>(null);
    const [torch, setTorch] = useState<'on' | 'off'>('off');
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');

    const prepareImage = async ({ uri, name, type, width, height, shouldResize }: { uri: string; name?: string | null; type?: string | null; width?: number; height?: number; shouldResize?: boolean }): Promise<IWineImage> => {
        const normalizedUri = uri.startsWith('file://') ? uri : `file://${uri}`;
        const uriName = normalizedUri.split('/').pop();
        if (shouldResize && width && height && isAndroid) {
            try {
                if (ImageResizer?.createResizedImage) {
                    const resized = await ImageResizer.createResizedImage(
                        normalizedUri,
                        width,
                        height,
                        'JPEG',
                        100,
                        0,
                    );

                    return {
                        uri: resized.uri,
                        name: name || uriName || `photo-${Date.now()}.jpg`,
                        type: type || 'image/jpeg',
                    } as IWineImage;
                } else {
                    console.warn('⚠️ ImageResizer is not available. Using original image.');
                }
            } catch (error) {
                console.error('❌ Error resizing image:', error);
                console.warn('⚠️ Falling back to original image.');
            }
        }

        return {
            uri: normalizedUri,
            name: name || uriName || `photo-${Date.now()}.jpg`,
            type: type || 'image/jpeg',
        } as IWineImage;
    };

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    useFocusEffect(
        useCallback(() => {
            wineModel.image = null;
        }, []),
    );

    useEffect(() => {
        if (appState !== 'active' || !isFocused) {
            Promise.resolve().then(() => setTorch('off'));
        }
    }, [appState, isFocused]);

    useEffect(() => {
        return () => setTorch('off');
    }, []);

    const handleGalleryPress = () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 1 }, async response => {
            if (response.didCancel || response.errorCode) return;

            const asset = response.assets?.[0];
            if (asset?.uri) {
                wineModel.image = await prepareImage({
                    uri: asset.uri,
                    name: asset.fileName,
                    type: asset.type,
                });
                navigation.navigate('ScanResultsListView');
            }
        });
    };

    const handleTakePhotoPress = async () => {
        try {
            const options: TakePhotoOptions & { qualityPrioritization?: 'speed' | 'balanced' | 'quality' } = {
                flash: torch === 'on' ? 'on' : 'off',
                qualityPrioritization: 'quality',
            };

            const photo = await cameraRef.current?.takePhoto(options);

            if (photo?.path) {
                wineModel.image = await prepareImage({
                    uri: photo.path,
                    name: photo.path.split('/').pop(),
                    type: (photo as PhotoFile & { mimeType?: string }).mimeType || 'image/jpeg',
                    width: photo.width,
                    height: photo.height,
                    shouldResize: true,
                });
                navigation.navigate('ScanResultsListView');
            }
        } catch (error) {
            console.error('❌ Error taking photo:', JSON.stringify(error, null, 2));
        }
    };

    const handleCrossPress = () => {
        setTorch('off');
        navigation.goBack();
    };

    const handleCreatePress = () => {
        navigation.navigate('AddWineView');
    };

    return {
        appState, torch, setTorch, handleGalleryPress, handleTakePhotoPress, handleCrossPress, handleCreatePress, cameraRef,
        device, hasPermission, 
    };
};
