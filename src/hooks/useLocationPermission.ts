import { useEffect } from 'react';
import { locationModel } from '@/entities/location/LocationModel';
import { getCurrentLocationPayload } from '@/libs/locations/getCurrentLocationPayload';
import { usePermissionGuard } from '@/hooks/usePermissionGuard';

let locationInitPromise: Promise<void> | null = null;

interface IProps {
    showDeniedModal?: boolean;
    requestIfNeeded?: boolean;
}

export const useLocationPermission = ({ showDeniedModal = true, requestIfNeeded = true }: IProps = {}) => {
    const { onEnsurePermissionAccess, permissionModalProps } = usePermissionGuard();

    useEffect(() => {
        const initLocation = async () => {
            try {
                locationModel.setIsLoading(true);
                const hasPermission = await onEnsurePermissionAccess(
                    'geolocation',
                    showDeniedModal,
                    requestIfNeeded,
                );
                locationModel.setHasPermission(hasPermission);

                if (!hasPermission) {
                    return;
                }

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
    }, [onEnsurePermissionAccess, requestIfNeeded, showDeniedModal]);

    return {
        userLocation: locationModel.userLocation,
        hasPermission: locationModel.hasPermission,
        isLoading: locationModel.isLoading,
        permissionModalProps,
    };
};
