import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppState } from '@react-native-community/hooks';
import { StackActions, useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';
import { openCropper, openPicker } from 'react-native-image-crop-picker';
import type { Image as ImageCropPickerResult } from 'react-native-image-crop-picker';
import { useCameraDevice, useCameraPermission, usePhotoOutput } from 'react-native-vision-camera';
import type { CameraOrientation } from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
import { IWineImage } from '@/entities/wine/types/IWineImage';
import { wineSetScannerModel } from '@/entities/events/WineSetScannerModel';
import { wineModel } from '@/entities/wine/models/WineModel';
import { isAndroid, isIOS } from '@/utils';
import { localization } from '@/UIProvider/localization/Localization';

const SCANNER_CROP_MAX_SIZE = 2048;

interface IImageCropPickerError {
    code?: string;
}

const getCropDimensions = (width?: number, height?: number) => {
    const sourceWidth = width || SCANNER_CROP_MAX_SIZE;
    const sourceHeight = height || SCANNER_CROP_MAX_SIZE;
    const scale = Math.min(1, SCANNER_CROP_MAX_SIZE / sourceWidth, SCANNER_CROP_MAX_SIZE / sourceHeight);

    return {
        width: Math.max(1, Math.round(sourceWidth * scale)),
        height: Math.max(1, Math.round(sourceHeight * scale)),
    };
};

const isCropCancelled = (error: unknown) => {
    if (!error || typeof error !== 'object') {
        return false;
    }

    return (error as IImageCropPickerError).code === 'E_PICKER_CANCELLED';
};

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

    const onUseCroppedImage = useCallback((croppedImage: ImageCropPickerResult) => {
        const normalizedUri = croppedImage.path.startsWith('file://')
            ? croppedImage.path
            : `file://${croppedImage.path}`;

        wineModel.image = {
            uri: normalizedUri,
            name: croppedImage.filename || croppedImage.path.split('/').pop() || `wine-label-${Date.now()}.jpg`,
            type: croppedImage.mime || 'image/jpeg',
        };
        navigation.navigate('ScanResultsListView');
    }, [navigation]);

    const onGalleryPress = useCallback(async () => {
        const cropperOptions = {
            mediaType: 'photo' as const,
            freeStyleCropEnabled: true,
            compressImageMaxWidth: SCANNER_CROP_MAX_SIZE,
            compressImageMaxHeight: SCANNER_CROP_MAX_SIZE,
            compressImageQuality: 1,
            hideBottomControls: true,
            cropperRotateButtonsHidden: true,
            cropperToolbarTitle: localization.t('scanner.cropLabelPhoto'),
            cropperChooseText: localization.t('common.choose'),
            cropperCancelText: localization.t('common.cancel'),
        };

        if (isIOS) {
            try {
                const croppedImage = await openPicker({
                    ...cropperOptions,
                    width: SCANNER_CROP_MAX_SIZE,
                    height: SCANNER_CROP_MAX_SIZE,
                    cropping: true,
                    waitAnimationEnd: true,
                });

                onUseCroppedImage(croppedImage);
            } catch (error) {
                if (!isCropCancelled(error)) {
                    console.error('Error selecting or cropping scanner photo:', error);
                }
            }

            return;
        }

        const response = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 1 });

        if (response.didCancel) {
            return;
        }

        if (response.errorCode) {
            console.error('Error selecting scanner photo:', response.errorCode, response.errorMessage);
            return;
        }

        const asset = response.assets?.[0];
        if (!asset?.uri) {
            return;
        }

        const cropDimensions = getCropDimensions(asset.width, asset.height);

        try {
            const croppedImage = await openCropper({
                ...cropperOptions,
                path: asset.uri,
                width: cropDimensions.width,
                height: cropDimensions.height,
            });
            onUseCroppedImage(croppedImage);
        } catch (error) {
            if (!isCropCancelled(error)) {
                console.error('Error cropping scanner photo:', error);
            }
        }
    }, [onUseCroppedImage]);

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
