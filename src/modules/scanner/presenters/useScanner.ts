import { useEffect, useRef, useState } from 'react';
import { useAppState } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';
import { Camera, TakePhotoOptions, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export const useScanner = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const appState = useAppState();
    const cameraRef = useRef<Camera>(null);
    const [torch, setTorch] = useState<'on' | 'off'>('off');
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    const handleGalleryPress = () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 1 }, response => {
            if (response.didCancel || response.errorCode) return;

            const asset = response.assets?.[0];
            if (asset?.uri) {
                navigation.navigate('ScanResultsListView', { image: asset });
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
                navigation.navigate('ScanResultsListView', { image: photo });
            }
        } catch (e) {
            console.log('❌ Error taking photo:', e);
        }
    };

    const handleCrossPress = () => {
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
