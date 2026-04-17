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

const GEOLOCATION_TIMEOUT = {
    STANDARD: 15000,
    HIGH_ACCURACY: 25000,
};

const GEOLOCATION_MAXIMUM_AGE = {
    STANDARD: 10000,
    HIGH_ACCURACY: 5000,
};

let locationInitPromise: Promise<void> | null = null;

export const useLocationPermission = () => {
    const { t } = useUiContext();

    useEffect(() => {
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
                        },
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
                    if (!highAccuracy && error.code === GEOLOCATION_ERROR_CODES.TIMEOUT) {
                        getCurrentLocation(true);
                        return;
                    }
                    console.warn('Error getting location:', error);
                    locationModel.setIsLoading(false);
                },
                {
                    enableHighAccuracy: highAccuracy,
                    timeout: highAccuracy ? GEOLOCATION_TIMEOUT.HIGH_ACCURACY : GEOLOCATION_TIMEOUT.STANDARD,
                    maximumAge: highAccuracy ? GEOLOCATION_MAXIMUM_AGE.HIGH_ACCURACY : GEOLOCATION_MAXIMUM_AGE.STANDARD,
                },
            );
        };

        const initLocation = async () => {
            const granted = await requestLocationPermission();
            locationModel.setHasPermission(granted);

            if (granted) {
                getCurrentLocation();
            } else {
                locationModel.setIsLoading(false);
            }
        };

        if (!locationInitPromise) {
            locationInitPromise = initLocation().finally(() => {
                locationInitPromise = null;
            });
        }
    }, [t]);

    return {
        userLocation: locationModel.userLocation,
        hasPermission: locationModel.hasPermission,
        isLoading: locationModel.isLoading,
    };
};
