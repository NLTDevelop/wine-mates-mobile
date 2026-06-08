import { PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import type { GeolocationResponse } from '@react-native-community/geolocation';
import * as RNLocalize from 'react-native-localize';
import { isAndroid, isIOS } from '@/utils';
import { LocationDto } from '@/entities/users/dto/Location.dto';

const GEOLOCATION_ERROR_CODES = {
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

const requestLocationPermission = async () => {
    if (isIOS) {
        return new Promise<boolean>((resolve) => {
            Geolocation.requestAuthorization(
                () => {
                    resolve(true);
                },
                () => {
                    resolve(false);
                },
            );
        });
    }

    if (isAndroid) {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return false;
};

const getCurrentPosition = (highAccuracy: boolean) => {
    return new Promise<GeolocationResponse>((resolve, reject) => {
        Geolocation.getCurrentPosition(
            resolve,
            reject,
            {
                enableHighAccuracy: highAccuracy,
                timeout: highAccuracy ? GEOLOCATION_TIMEOUT.HIGH_ACCURACY : GEOLOCATION_TIMEOUT.STANDARD,
                maximumAge: highAccuracy ? GEOLOCATION_MAXIMUM_AGE.HIGH_ACCURACY : GEOLOCATION_MAXIMUM_AGE.STANDARD,
            },
        );
    });
};

export const getCurrentLocationPayload = async (): Promise<LocationDto | null> => {
    const granted = await requestLocationPermission();

    if (!granted) {
        return null;
    }

    try {
        const position = await getCurrentPosition(false);

        return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timezone: RNLocalize.getTimeZone(),
        };
    } catch (error: any) {
        if (error?.code !== GEOLOCATION_ERROR_CODES.TIMEOUT) {
            return null;
        }

        const position = await getCurrentPosition(true);

        return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timezone: RNLocalize.getTimeZone(),
        };
    }
};
