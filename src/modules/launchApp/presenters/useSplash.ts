import { userModel } from '@/entities/users/UserModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';

export const useSplash = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        setTimeout(() => {
            if (userModel.token) {
                navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
            } else {
                navigation.reset({ index: 0, routes: [{ name: 'WelcomeView' }] });
            }
        }, 2000);
    }, [navigation]);
};
