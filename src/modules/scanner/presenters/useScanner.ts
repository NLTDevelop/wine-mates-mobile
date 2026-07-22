import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppState } from '@react-native-community/hooks';
import { StackActions, useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';
import { useCameraDevice, useCameraPermission, usePhotoOutput } from 'react-native-vision-camera';
import type { CameraOrientation } from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
import { IWineImage } from '@/entities/wine/types/IWineImage';
import { wineSetScannerModel } from '@/entities/events/WineSetScannerModel';
import { wineModel } from '@/entities/wine/models/WineModel';
import { isAndroid } from '@/utils';

export const useScanner = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const appState = useAppState();
    const isFocused = useIsFocused();
    const [torch, setTorch] = useState<'on' | 'off'>('off');
    const [isPreviewStarted, setIsPreviewStarted] = useState(false);
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const photoOutput = usePhotoOutput({ quality: 1, qualityPrioritization: 'quality' });
    const cameraOutputs = useMemo(() => [photoOutput], [photoOutput]);
    const isCameraActive = isFocused && appState === 'active';
    const torchMode = isCameraActive && isPreviewStarted ? torch : undefined;
    const isTorchDisabled = !isCameraActive || !isPreviewStarted;

    const prepareCameraImage = async ({ uri, width, height, orientation }: {
        uri: string;
        width: number;
        height: number;
        orientation: CameraOrientation;
    }): Promise<IWineImage> => {
        const normalizedUri = uri.includes('://') ? uri : `file://${uri}`;
        const originalImage = {
            uri: normalizedUri,
            name: normalizedUri.split('/').pop() || `scanner-photo-${Date.now()}.jpg`,
            type: 'image/jpeg',
        };

        if (!isAndroid || orientation === 'up') {
            return originalImage;
        }

        try {
            const isSideways = orientation === 'left' || orientation === 'right';
            const correctedWidth = isSideways ? height : width;
            const correctedHeight = isSideways ? width : height;
            const orientationCorrectedImage = await ImageResizer.createResizedImage(
                normalizedUri,
                correctedWidth,
                correctedHeight,
                'JPEG',
                100,
                0,
            );

            return {
                uri: orientationCorrectedImage.uri,
                name: orientationCorrectedImage.name || originalImage.name,
                type: 'image/jpeg',
            };
        } catch (error) {
            console.error('Error correcting scanner photo orientation:', error);
            return originalImage;
        }
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

    const onPreviewStarted = useCallback(() => {
        setIsPreviewStarted(true);
    }, []);

    const onPreviewStopped = useCallback(() => {
        setIsPreviewStarted(false);
        setTorch('off');
    }, []);

    const onGalleryPress = () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 1 }, async response => {
            if (response.didCancel || response.errorCode) return;

            const asset = response.assets?.[0];
            if (asset?.uri) {
                wineModel.image = {
                    uri: asset.uri,
                    name: asset.fileName || `gallery-photo-${Date.now()}.jpg`,
                    type: asset.type || 'image/jpeg',
                };
                navigation.navigate('ScanResultsListView');
            }
        });
    };

    const onTakePhotoPress = async () => {
        if (!isCameraActive || !isPreviewStarted) {
            return;
        }

        try {
            const photo = await photoOutput.capturePhoto({ flashMode: torch === 'on' ? 'on' : 'off' }, {});

            try {
                const photoPath = await photo.saveToTemporaryFileAsync();
                wineModel.image = await prepareCameraImage({
                    uri: photoPath,
                    width: photo.width,
                    height: photo.height,
                    orientation: photo.orientation,
                });
                navigation.navigate('ScanResultsListView');
            } finally {
                photo.dispose();
            }
        } catch (error) {
            console.error('❌ Error taking photo:', JSON.stringify(error, null, 2));
        }
    };

    const onCrossPress = useCallback(() => {
        setTorch('off');
        const addWineSetScannerState = wineSetScannerModel.state;

        if (addWineSetScannerState) {
            wineSetScannerModel.clear();
            navigation.dispatch(
                StackActions.popTo('AddWineSetView', {
                    draft: addWineSetScannerState.draft,
                    initialSelectedWines: addWineSetScannerState.selectedWines,
                    editEventId: addWineSetScannerState.editEventId,
                    isDuplicateEvent: addWineSetScannerState.isDuplicateEvent,
                }),
            );
            return;
        }

        navigation.goBack();
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            const onHardwareBackPress = () => {
                onCrossPress();
                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);

            return () => {
                subscription.remove();
            };
        }, [onCrossPress]),
    );

    const onCreatePress = () => {
        navigation.navigate('AddWineView');
    };

    const onTorchPress = useCallback(() => {
        if (!isCameraActive || !isPreviewStarted) {
            return;
        }

        setTorch(prev => (prev === 'on' ? 'off' : 'on'));
    }, [isCameraActive, isPreviewStarted]);

    return {
        torch, onGalleryPress, onTakePhotoPress, onCrossPress, onCreatePress, onTorchPress,
        onPreviewStarted, onPreviewStopped, device, cameraOutputs, isCameraActive, torchMode,
        isTorchDisabled, hasPermission,
    };
};
