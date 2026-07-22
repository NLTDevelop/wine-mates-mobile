import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const TERMS_URL = 'https://www.google.com/';

export const useWelcome = (onCloseAlert: () => void) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onSignInPress = useCallback(() => {
        navigation.navigate('SignInView');
    }, [navigation]);

    const onJoinNowPress = useCallback(() => {
        onCloseAlert();
        setTimeout(() => {
            navigation.navigate('MyLevelView');
        }, 400);
    }, [navigation, onCloseAlert]);

    const onTermsPress = useCallback(() => {
        Linking.openURL(TERMS_URL);
    }, []);

    return { onSignInPress, onJoinNowPress, onTermsPress };
};
