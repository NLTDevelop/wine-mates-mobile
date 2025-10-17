import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';

export const usePersonalProfile = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const handleLogout = useCallback(() => {
        navigation.reset({ index: 0, routes: [{ name: 'WelcomeView' }] });
    }, [navigation]);

    return { handleLogout };
};
