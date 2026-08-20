import { useCallback, useMemo, useRef, useState } from 'react';
import { PermissionStatus as CameraPermissionStatus, VisionCamera } from 'react-native-vision-camera';
import {
    check,
    openSettings,
    PERMISSIONS,
    Permission,
    PermissionStatus,
    request,
    RESULTS,
} from 'react-native-permissions';
import { isAndroid, isIOS } from '@/utils';
import { localization } from '@/UIProvider/localization/Localization';
import { TPermissionGuardType } from '@/hooks/types/TPermissionGuardType';

interface IPermissionModalText {
    title: string;
    description: string;
}

const PERMISSION_MODAL_DELAY = 350;

const waitPermissionDialogClose = () => {
    return new Promise<void>(resolve => {
        setTimeout(resolve, PERMISSION_MODAL_DELAY);
    });
};

const PERMISSION_MODAL_TEXTS: Record<TPermissionGuardType, IPermissionModalText> = {
    camera: {
        title: 'permissions.cameraTitle',
        description: 'permissions.cameraMessage',
    },
    geolocation: {
        title: 'permissions.locationTitle',
        description: 'permissions.locationMessage',
    },
};

const GRANTED_CAMERA_STATUSES = new Set<CameraPermissionStatus>(['authorized']);
const REQUESTABLE_CAMERA_STATUSES = new Set<CameraPermissionStatus>(['not-determined']);
const GRANTED_PERMISSION_STATUSES = new Set<PermissionStatus>([RESULTS.GRANTED, RESULTS.LIMITED]);
const REQUESTABLE_PERMISSION_STATUSES = new Set<PermissionStatus>([RESULTS.DENIED]);

const getGeolocationPermission = (): Permission | null => {
    if (isIOS) {
        return PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    }

    if (isAndroid) {
        return PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    }

    return null;
};

export const usePermissionGuard = () => {
    const [visiblePermissionType, setVisiblePermissionType] = useState<TPermissionGuardType | null>(null);
    const visiblePermissionTypeRef = useRef<TPermissionGuardType | null>(null);

    const onShowPermissionModal = useCallback(async (permissionType: TPermissionGuardType) => {
        if (visiblePermissionTypeRef.current) {
            return;
        }

        await waitPermissionDialogClose();

        if (visiblePermissionTypeRef.current) {
            return;
        }

        visiblePermissionTypeRef.current = permissionType;
        setVisiblePermissionType(permissionType);
    }, []);

    const onClosePermissionModal = useCallback(() => {
        visiblePermissionTypeRef.current = null;
        setVisiblePermissionType(null);
    }, []);

    const onOpenPermissionSettings = useCallback(() => {
        onClosePermissionModal();
        openSettings('application').catch(error => {
            console.warn('usePermissionGuard -> onOpenPermissionSettings: ', error);
        });
    }, [onClosePermissionModal]);

    const onEnsureCameraPermission = useCallback(async () => {
        let status = VisionCamera.cameraPermissionStatus;

        if (GRANTED_CAMERA_STATUSES.has(status)) {
            return true;
        }

        if (REQUESTABLE_CAMERA_STATUSES.has(status)) {
            await VisionCamera.requestCameraPermission();
            status = VisionCamera.cameraPermissionStatus;

            if (GRANTED_CAMERA_STATUSES.has(status)) {
                return true;
            }
        }

        await onShowPermissionModal('camera');
        return false;
    }, [onShowPermissionModal]);

    const onEnsureGeolocationPermission = useCallback(async (
        showDeniedModal: boolean,
        requestIfNeeded: boolean,
    ) => {
        const permission = getGeolocationPermission();

        if (!permission) {
            return false;
        }

        let status = await check(permission);

        if (GRANTED_PERMISSION_STATUSES.has(status)) {
            return true;
        }

        if (requestIfNeeded && REQUESTABLE_PERMISSION_STATUSES.has(status)) {
            status = await request(permission);

            if (GRANTED_PERMISSION_STATUSES.has(status)) {
                return true;
            }
        }

        if (showDeniedModal) {
            await onShowPermissionModal('geolocation');
        }

        return false;
    }, [onShowPermissionModal]);

    const onEnsurePermissionAccess = useCallback(async (
        permissionType: TPermissionGuardType,
        showDeniedModal = true,
        requestIfNeeded = true,
    ) => {
        if (visiblePermissionTypeRef.current) {
            return false;
        }

        if (permissionType === 'camera') {
            return onEnsureCameraPermission();
        }

        return onEnsureGeolocationPermission(showDeniedModal, requestIfNeeded);
    }, [onEnsureCameraPermission, onEnsureGeolocationPermission]);

    const permissionModalProps = useMemo(() => {
        const modalText = visiblePermissionType
            ? PERMISSION_MODAL_TEXTS[visiblePermissionType]
            : PERMISSION_MODAL_TEXTS.geolocation;

        return {
            isVisible: !!visiblePermissionType,
            title: localization.t(modalText.title),
            description: localization.t(modalText.description),
            confirmButtonText: localization.t('permissions.openSettings'),
            onClose: onClosePermissionModal,
            onOpenSettings: onOpenPermissionSettings,
        };
    }, [onClosePermissionModal, onOpenPermissionSettings, visiblePermissionType]);

    return {
        onEnsurePermissionAccess,
        permissionModalProps,
    };
};
