import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useAvatarPicker = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onOpenCamera = useCallback(() => {
        navigation.push('AvatarCameraView');
    }, [navigation]);

    return {
        onOpenCamera,
    };
};
