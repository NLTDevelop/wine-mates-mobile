import { userModel } from '@/entities/users/UserModel';
import { userService } from '@/entities/users/UserService';
import { getCurrentLocationPayload } from '@/libs/locations/getCurrentLocationPayload';
import { locationModel } from '@/entities/location/LocationModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';

const SPLASH_DELAY = 2000;

const waitSplashDelay = () => {
    return new Promise<void>(resolve => {
        setTimeout(resolve, SPLASH_DELAY);
    });
};

const initLocation = async () => {
    try {
        locationModel.setIsLoading(true);
        const locationPayload = await getCurrentLocationPayload();
        locationModel.setHasPermission(!!locationPayload);

        if (locationPayload) {
            locationModel.setUserLocation({
                latitude: locationPayload.latitude,
                longitude: locationPayload.longitude,
            });
        }

        return locationPayload;
    } catch (error) {
        console.warn('useSplash -> initLocation: ', error);
        locationModel.setHasPermission(false);

        return null;
    } finally {
        locationModel.setIsLoading(false);
    }
};

export const useSplash = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        const startApp = async () => {
            const locationPromise = initLocation();

            await waitSplashDelay();

            if (userModel.token) {
                const response = await userService.me();
                if (response.isError) {
                    userModel.clear();
                    navigation.reset({ index: 0, routes: [{ name: 'WelcomeView' }] });
                    return;
                }

                const locationPayload = await locationPromise;
                if (locationPayload) {
                    userService.location(locationPayload);
                }

                navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
                return;
            }

            await locationPromise;
            navigation.reset({ index: 0, routes: [{ name: 'WelcomeView' }] });
        };

        startApp();
    }, [navigation]);
};
