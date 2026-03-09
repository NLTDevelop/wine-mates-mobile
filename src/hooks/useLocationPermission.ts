import { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { isAndroid, isIOS } from '@/utils';
import { useUiContext } from '@/UIProvider';
import { locationModel } from '@/entities/location/LocationModel';

const GEOLOCATION_ERROR_CODES = {
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
};

export const useLocationPermission = () => {
    const { t } = useUiContext();

    const requestLocationPermission = async (): Promise<boolean> => {
        if (isIOS) {
            return new Promise((resolve) => {
                Geolocation.requestAuthorization(() => {
                    resolve(true);
                });
            });
        }

        if (isAndroid) {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: t('permissions.locationTitle'),
                        message: t('permissions.locationMessage'),
                        buttonNeutral: t('permissions.askLater'),
                        buttonNegative: t('permissions.cancel'),
                        buttonPositive: t('permissions.ok'),
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }

        return false;
    };

    const getCurrentLocation = (highAccuracy: boolean = false) => {
        locationModel.setIsLoading(true);
        Geolocation.getCurrentPosition(
            (position) => {
                locationModel.setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                locationModel.setIsLoading(false);
            },
            (error) => {
                console.warn('Error getting location:', error);
                if (!highAccuracy && error.code === GEOLOCATION_ERROR_CODES.TIMEOUT) {
                    getCurrentLocation(true);
                    return;
                }
                locationModel.setIsLoading(false);
            },
            {
                enableHighAccuracy: highAccuracy,
                timeout: highAccuracy ? 25000 : 15000,
                maximumAge: highAccuracy ? 5000 : 10000,
            }
        );
    };

    useEffect(() => {
        const initLocation = async () => {
            const granted = await requestLocationPermission();
            locationModel.setHasPermission(granted);

            if (granted) {
                getCurrentLocation();
            } else {
                locationModel.setIsLoading(false);
            }
        };

        initLocation();
    }, []);

    return {
        userLocation: locationModel.userLocation,
        hasPermission: locationModel.hasPermission,
        isLoading: locationModel.isLoading,
    };
};
