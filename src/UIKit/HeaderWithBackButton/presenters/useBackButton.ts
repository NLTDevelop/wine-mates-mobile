import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { Keyboard } from 'react-native';

export const useBackButton = (onPressBack?: () => void) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onGoBack = useCallback(() => {
        Keyboard.dismiss();
        if (onPressBack) {
            onPressBack();
        } else {
            navigation.canGoBack() && navigation.goBack();
        }
    }, [navigation, onPressBack]);

    return { onGoBack };
};

