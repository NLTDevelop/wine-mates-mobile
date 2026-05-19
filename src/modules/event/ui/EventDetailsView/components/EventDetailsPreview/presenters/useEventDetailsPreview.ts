import { useCallback, useMemo, useRef } from 'react';
import Share from 'react-native-share';
import { createEventDeepLink } from '@/navigation/rootNavigator/linking';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

const QR_CODE_IMAGE_PREFIX = 'data:image/png;base64,';

type QrCodeRef = {
    toDataURL: (callback: (data: string) => void) => void;
};

interface IProps {
    eventId: number;
}

export const useEventDetailsPreview = ({ eventId }: IProps) => {
    const qrCodeRef = useRef<QrCodeRef | null>(null);
    const eventDeepLink = useMemo(() => createEventDeepLink(eventId), [eventId]);

    const onSharePress = useCallback(async (qrCodeDataUrl: string | null) => {
        if (!eventDeepLink || !qrCodeDataUrl) {
            toastService.showError(localization.t('common.errorHappened'), localization.t('event.shareQrCodeUnavailable'));
            return;
        }

        try {
            await Share.open({
                failOnCancel: false,
                filename: `wine-event-${eventId}-qr.png`,
                message: `${localization.t('event.shareQrCodeMessage')}\n${eventDeepLink}`,
                title: localization.t('event.shareQrCodeTitle'),
                type: 'image/png',
                url: qrCodeDataUrl,
                subject: localization.t('event.shareQrCodeTitle'),
                useInternalStorage: true,
            });
        } catch (error) {
            console.warn('useEventDetailsPreview -> onSharePress: ', error);
            toastService.showError(localization.t('common.errorHappened'), localization.t('common.somethingWentWrong'));
        }
    }, [eventDeepLink, eventId]);

    const onQrCodeRef = useCallback((ref: QrCodeRef | null) => {
        qrCodeRef.current = ref;
    }, []);

    const onQrCodeSharePress = useCallback((data?: string) => {
        if (!data) {
            onSharePress(null);
            return;
        }

        onSharePress(`${QR_CODE_IMAGE_PREFIX}${data}`);
    }, [onSharePress]);

    const onShareIconPress = useCallback(() => {
        qrCodeRef.current?.toDataURL(onQrCodeSharePress);
        if (!qrCodeRef.current) {
            onQrCodeSharePress();
        }
    }, [onQrCodeSharePress]);

    return {
        eventDeepLink,
        onQrCodeRef,
        onShareIconPress,
    };
};
