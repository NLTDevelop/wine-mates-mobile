import { useCallback, useMemo } from 'react';
import { createEventDeepLink } from '@/navigation/rootNavigator/linking';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { prepareEventShareMessage } from '@/modules/event/utils/prepareEventShareMessage';
import { createMapLink } from '@/modules/event/utils/createMapLink';
import { shareEventQrCode } from '@/modules/event/utils/shareEventQrCode';
import { useEventQrCodeShare } from '@/modules/event/presenters/useEventQrCodeShare';
import { IEventDetailsPreviewData } from '../../../types/IEventDetailsPreviewData';

interface IProps {
    data: IEventDetailsPreviewData;
    eventId: number;
}

export const useEventDetailsPreview = ({ data, eventId }: IProps) => {
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

    const { onQrCodeRef, onShareQrCodePress } = useEventQrCodeShare({ onShareQrPress: onSharePress });

    return {
        eventDeepLink,
        onQrCodeRef,
        onShareIconPress: onShareQrCodePress,
    };
};
