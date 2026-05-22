import { useCallback, useMemo, useRef } from 'react';
import { createEventDeepLink } from '@/navigation/rootNavigator/linking';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { prepareEventShareMessage } from '@/modules/event/utils/prepareEventShareMessage';
import { createMapLink } from '@/modules/event/utils/createMapLink';
import { shareEventQrCode } from '@/modules/event/utils/shareEventQrCode';
import { IEventDetailsPreviewData } from '../../../types/IEventDetailsPreviewData';

const QR_CODE_IMAGE_PREFIX = 'data:image/png;base64,';

type QrCodeRef = {
    toDataURL: (callback: (data: string) => void) => void;
};

interface IProps {
    data: IEventDetailsPreviewData;
    eventId: number;
}

export const useEventDetailsPreview = ({ data, eventId }: IProps) => {
    const qrCodeRef = useRef<QrCodeRef | null>(null);
    const eventDeepLink = useMemo(() => createEventDeepLink(eventId), [eventId]);

    const onSharePress = useCallback(
        async (qrCodeDataUrl: string | null) => {
            if (!eventDeepLink || !qrCodeDataUrl) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('event.shareQrCodeUnavailable'),
                );
                return;
            }

            try {
                const mapLink = createMapLink(data.latitude, data.longitude);
                const labels = {
                    title: localization.t('event.shareEventName'),
                    dateTime: localization.t('event.shareEventDateTime'),
                    meetingPlaceName: localization.t('event.shareEventMeetingPlaceName'),
                    location: localization.t('event.shareEventLocation'),
                    mapLink: localization.t('event.shareEventMap'),
                    price: localization.t('event.price'),
                    eventType: localization.t('event.eventType'),
                    tastingType: localization.t('event.tastingType'),
                };
                const message = prepareEventShareMessage({
                    intro: localization.t('event.shareQrCodeMessage'),
                    labels,
                    title: data.title,
                    dateTime: data.formattedDateTime,
                    meetingPlaceName: data.meetingPlaceName,
                    location: data.locationLabel,
                    mapLink,
                    price: data.priceLabel,
                    eventType: data.eventTypeLabel,
                    tastingType: data.tastingTypeLabel,
                    link: eventDeepLink,
                });
                const shareTitle = localization.t('event.shareQrCodeTitle');

                await shareEventQrCode({
                    filename: `wine-event-${eventId}-qr.png`,
                    message,
                    qrCodeImageUrl: qrCodeDataUrl,
                    title: shareTitle,
                });
            } catch (error) {
                console.warn('useEventDetailsPreview -> onSharePress: ', error);
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            }
        },
        [data, eventDeepLink, eventId],
    );

    const onQrCodeRef = useCallback((ref: QrCodeRef | null) => {
        qrCodeRef.current = ref;
    }, []);

    const onQrCodeSharePress = useCallback(
        (qrCodeData?: string) => {
            if (!qrCodeData) {
                onSharePress(null);
                return;
            }

            onSharePress(`${QR_CODE_IMAGE_PREFIX}${qrCodeData}`);
        },
        [onSharePress],
    );

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
