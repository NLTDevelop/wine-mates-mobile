import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useSignUpFooter = (onCloseAlert: () => void) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onSignUpPress = useCallback(() => {
        onCloseAlert();
        setTimeout(() => {
            navigation.navigate('MyLevelView');
        }, 400);
    }, [navigation, onCloseAlert]);

    return { onSignUpPress };
};
