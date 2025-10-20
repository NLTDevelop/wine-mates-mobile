import { userModel } from '@/entities/users/UserModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';

export const useIsUserAuthorized = () => {
    const token = userModel.token;
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        if (!token) {
            onExit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const onExit = () => {
        userModel.clear();
        navigation.reset({ index: 0, routes: [{ name: 'WelcomeView' }] });
    };
};
