import { useEffect } from 'react';
import { locationModel } from '@/entities/location/LocationModel';
import { getCurrentLocationPayload } from '@/libs/locations/getCurrentLocationPayload';

let locationInitPromise: Promise<void> | null = null;

export const useLocationPermission = () => {
    useEffect(() => {
        const initLocation = async () => {
            try {
                locationModel.setIsLoading(true);
                const payload = await getCurrentLocationPayload();
                locationModel.setHasPermission(!!payload);

                if (payload) {
                    locationModel.setUserLocation({
                        latitude: payload.latitude,
                        longitude: payload.longitude,
                    });
                }
            } catch (error) {
                console.warn('Error getting location:', error);
                locationModel.setHasPermission(false);
            } finally {
                locationModel.setIsLoading(false);
            }
        };

        if (!locationInitPromise) {
            locationInitPromise = initLocation().finally(() => {
                locationInitPromise = null;
            });
        }
    }, []);

    return {
        userLocation: locationModel.userLocation,
        hasPermission: locationModel.hasPermission,
        isLoading: locationModel.isLoading,
    };
};
