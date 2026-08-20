import { userModel } from '@/entities/users/UserModel';
import { userService } from '@/entities/users/UserService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';

const SPLASH_DELAY = 2000;
const UNAUTHORIZED_STATUS = 401;

const waitSplashDelay = () => {
    return new Promise<void>(resolve => {
        setTimeout(resolve, SPLASH_DELAY);
    });
};

export const useSplash = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        const startApp = async () => {
            await waitSplashDelay();

            if (userModel.token) {
                const response = await userService.me();
                if (response.isError && response.status === UNAUTHORIZED_STATUS) {
                    userModel.clear();
                    navigation.reset({ index: 0, routes: [{ name: 'WelcomeView' }] });
                    return;
                }

                if (response.isError) {
                    console.warn('useSplash -> me request failed without session reset:', {
                        status: response.status,
                        message: response.message,
                    });
                }

                navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
                return;
            }

            navigation.reset({ index: 0, routes: [{ name: 'WelcomeView' }] });
        };

        startApp();
    }, [navigation]);
};
