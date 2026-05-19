import { useCallback, useMemo, useRef, useState } from 'react';
import { IEvent } from '@/entities/events/types/IEvent';
import { EventType } from '@/entities/events/enums/EventType';
import { TastingType } from '@/entities/events/enums/TastingType';
import { localization } from '@/UIProvider/localization/Localization';
import { config } from '@/config';
import { userModel } from '@/entities/users/UserModel';
import { SavedEventStatus } from '@/entities/events/enums/SavedEventStatus';
import { AppliedEventStatus } from '@/entities/events/enums/AppliedEventStatus';
import Share from 'react-native-share';
import { createEventDeepLink } from '@/navigation/rootNavigator/linking';
import { toastService } from '@/libs/toast/toastService';
import { prepareEventParticipantsPreview } from '@/modules/event/utils/prepareEventParticipantsPreview';
import { prepareEventShareMessage } from '@/modules/event/utils/prepareEventShareMessage';
import { createMapLink } from '@/modules/event/utils/createMapLink';
import { formatEventPrice } from '@/modules/event/utils/formatEventPrice';

interface IUseEventCardProps {
    event: IEvent;
    appliedEventStatus?: string | null;
    onReadMorePress?: (eventId: number) => void;
    onFavoritePress?: (eventId: number) => void;
    onEditPress?: (eventId: number) => void;
    onCardPress?: (eventId: number) => void;
}

const STATIC_MAP_SIZE = '720x320';
const STATIC_MAP_ZOOM = 14;
const QR_CODE_IMAGE_PREFIX = 'data:image/png;base64,';

type QrCodeRef = {
    toDataURL: (callback: (data: string) => void) => void;
};
const STATIC_MAP_LIGHT_STYLE_PARAMS = [
    'style=element:geometry|color:0xf5f5f5',
    'style=element:labels.icon|visibility:off',
    'style=feature:road|element:geometry|color:0xffffff',
    'style=feature:road.arterial|element:geometry|color:0xffffff',
    'style=feature:water|element:geometry|color:0xc9e6ff',
    'style=feature:poi|element:geometry|color:0xeeeeee',
    'style=feature:landscape|element:geometry|color:0xf5f5f5',
];

export const useEventCard = ({
    event,
    appliedEventStatus = null,
    onReadMorePress,
    onFavoritePress,
    onEditPress,
    onCardPress,
}: IUseEventCardProps) => {
    const currentLocale = localization.locale || 'en';
    const [isCardPressed, setIsCardPressed] = useState(false);
    const qrCodeRef = useRef<QrCodeRef | null>(null);

    const startDateValue = useMemo(() => {
        return event.eventStartDate || event.eventDate;
    }, [event.eventDate, event.eventStartDate]);

    const endDateValue = useMemo(() => {
        return event.eventEndDate || event.eventDate;
    }, [event.eventDate, event.eventEndDate]);

    const startTimeValue = useMemo(() => {
        return event.eventStartTime || event.eventTime;
    }, [event.eventStartTime, event.eventTime]);

    const endTimeValue = useMemo(() => {
        return event.eventEndTime;
    }, [event.eventEndTime]);

    const parsedStartDate = useMemo(() => {
        if (!startDateValue) {
            return null;
        }

        const date = new Date(startDateValue);
        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return date;
    }, [startDateValue]);

    const parsedEndDate = useMemo(() => {
        if (!endDateValue) {
            return null;
        }

        const date = new Date(endDateValue);
        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return date;
    }, [endDateValue]);

    const month = useMemo(() => {
        if (!parsedStartDate) {
            return '';
        }

        return new Intl.DateTimeFormat(currentLocale, { month: 'short' })
            .format(parsedStartDate)
            .replace('.', '')
            .toUpperCase();
    }, [currentLocale, parsedStartDate]);

    const day = useMemo(() => {
        if (!parsedStartDate) {
            return '';
        }

        return new Intl.DateTimeFormat(currentLocale, { day: 'numeric' }).format(parsedStartDate);
    }, [currentLocale, parsedStartDate]);

    const formattedDateTime = useMemo(() => {
        if (!parsedStartDate) {
            return startTimeValue || '';
        }

        const startDateLabel = new Intl.DateTimeFormat(currentLocale, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        })
            .format(parsedStartDate)
            .replace('.', '');

        const endDateLabel = parsedEndDate
            ? new Intl.DateTimeFormat(currentLocale, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
              })
                  .format(parsedEndDate)
                  .replace('.', '')
            : startDateLabel;

        const dateLabel = startDateLabel === endDateLabel ? startDateLabel : `${startDateLabel} - ${endDateLabel}`;

        if (!startTimeValue && !endTimeValue) {
            return dateLabel;
        }

        const formatTime = (value?: string) => {
            if (!value) {
                return '';
            }

            const [hoursPart, minutesPart] = value.split(':');
            const hours = Number(hoursPart);
            const minutes = Number(minutesPart);
            if (Number.isNaN(hours) || Number.isNaN(minutes)) {
                return value;
            }

            const dateWithTime = new Date(parsedStartDate);
            dateWithTime.setHours(hours, minutes, 0, 0);

            return new Intl.DateTimeFormat(currentLocale, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }).format(dateWithTime);
        };

        const formattedStartTime = formatTime(startTimeValue);
        const formattedEndTime = formatTime(endTimeValue);

        if (formattedStartTime && formattedEndTime) {
            return `${dateLabel} · ${formattedStartTime}-${formattedEndTime}`;
        }

        if (formattedStartTime) {
            return `${dateLabel} · ${formattedStartTime}`;
        }

        if (formattedEndTime) {
            return `${dateLabel} · ${formattedEndTime}`;
        }

        return dateLabel;
    }, [currentLocale, endTimeValue, parsedEndDate, parsedStartDate, startTimeValue]);

    const priceLabel = useMemo(() => {
        return formatEventPrice(event.price, event.currency);
    }, [event.currency, event.price]);

    const eventTypeLabel =
        event.eventType === EventType.Parties ? localization.t('event.parties') : localization.t('event.tastings');

    const isAllSpotsFull = useMemo(() => {
        return typeof event.seats?.left === 'number' && event.seats.left <= 0;
    }, [event.seats?.left]);

    const eventStatusLabel = useMemo(() => {
        if (!('status' in event) || !event.status) {
            return '';
        }

        if (event.status === SavedEventStatus.FINISHED) {
            return localization.t('event.finished');
        }

        if (event.status === SavedEventStatus.CANCELED) {
            return localization.t('event.cancelled');
        }

        return String(event.status);
    }, [event]);

    const appliedEventStatusLabel = useMemo(() => {
        if (!appliedEventStatus) {
            return '';
        }

        if (appliedEventStatus === AppliedEventStatus.ACCEPTED) {
            return localization.t('event.confirmed');
        }

        if (appliedEventStatus === AppliedEventStatus.PENDING) {
            return localization.t('event.pending');
        }

        if (appliedEventStatus === AppliedEventStatus.REJECTED) {
            return localization.t('event.rejected');
        }

        if (appliedEventStatus === SavedEventStatus.CANCELED) {
            return localization.t('event.cancelled');
        }

        return String(appliedEventStatus);
    }, [appliedEventStatus]);

    const isPartyEvent = useMemo(() => {
        return event.eventType === EventType.Parties;
    }, [event.eventType]);

    const participantsPreviewData = useMemo(() => {
        return prepareEventParticipantsPreview(event.participants);
    }, [event.participants]);

    const onCardPressHandler = useCallback(() => {
        onCardPress?.(event.id);
    }, [event.id, onCardPress]);

    const onPressIn = useCallback(() => {
        setIsCardPressed(true);
    }, []);

    const onPressOut = useCallback(() => {
        setIsCardPressed(false);
    }, []);

    const onFavoritePressHandler = useCallback(() => {
        onFavoritePress?.(event.id);
    }, [event.id, onFavoritePress]);

    const onEditPressHandler = useCallback(() => {
        onEditPress?.(event.id);
    }, [event.id, onEditPress]);

    const isOwner = useMemo(() => {
        if (!event.ownerId || !userModel.user?.id) {
            return false;
        }

        return event.ownerId === userModel.user.id;
    }, [event.ownerId]);

    const onReadMorePressHandler = useCallback(() => {
        onReadMorePress?.(event.id);
    }, [event.id, onReadMorePress]);

    const eventDeepLink = useMemo(() => {
        return createEventDeepLink(event.id);
    }, [event.id]);

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
                const location = event.locationLabel || '';
                const mapLink = createMapLink(event.latitude, event.longitude);
                const tastingTypeLabel =
                    event.eventType === EventType.Parties
                        ? ''
                        : event.tastingType === TastingType.Blind
                          ? localization.t('event.tastingTypeBlind')
                          : localization.t('event.tastingTypeRegular');
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
                    title: event.theme,
                    dateTime: formattedDateTime,
                    meetingPlaceName: event.restaurantName,
                    location,
                    mapLink,
                    price: priceLabel,
                    eventType: eventTypeLabel,
                    tastingType: tastingTypeLabel,
                    link: eventDeepLink,
                });

                await Share.open({
                    failOnCancel: false,
                    filename: `wine-event-${event.id}-qr.png`,
                    message,
                    title: localization.t('event.shareQrCodeTitle'),
                    type: 'image/png',
                    url: qrCodeDataUrl,
                    subject: localization.t('event.shareQrCodeTitle'),
                    useInternalStorage: true,
                });
            } catch (error) {
                console.warn('useEventCard -> onSharePress: ', error);
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            }
        },
        [
            event.eventType,
            event.id,
            event.latitude,
            event.locationLabel,
            event.longitude,
            event.restaurantName,
            event.tastingType,
            event.theme,
            eventDeepLink,
            eventTypeLabel,
            formattedDateTime,
            priceLabel,
        ],
    );

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

    const onQrCodeRef = useCallback((ref: QrCodeRef | null) => {
        qrCodeRef.current = ref;
    }, []);

    const onShareIconPress = useCallback(() => {
        qrCodeRef.current?.toDataURL(onQrCodeSharePress);
        if (!qrCodeRef.current) {
            onQrCodeSharePress();
        }
    }, [onQrCodeSharePress]);

    const mapPreviewUri = useMemo(() => {
        const params = [
            `center=${event.latitude},${event.longitude}`,
            `zoom=${STATIC_MAP_ZOOM}`,
            `size=${STATIC_MAP_SIZE}`,
            'maptype=roadmap',
            `markers=color:red|${event.latitude},${event.longitude}`,
            ...STATIC_MAP_LIGHT_STYLE_PARAMS,
        ];

        if (config.googlePlacesApiKey) {
            params.push(`key=${config.googlePlacesApiKey}`);
        }

        return `https://maps.googleapis.com/maps/api/staticmap?${params.join('&')}`;
    }, [event.latitude, event.longitude]);

    return {
        month,
        day,
        formattedDateTime,
        priceLabel,
        eventTypeLabel,
        isAllSpotsFull,
        eventStatusLabel,
        appliedEventStatusLabel,
        isPartyEvent,
        isCardPressed,
        onCardPress: onCardPressHandler,
        onPressIn,
        onPressOut,
        onReadMorePress: onReadMorePressHandler,
        onQrCodeSharePress,
        onQrCodeRef,
        onShareIconPress,
        eventDeepLink,
        onFavoritePress: onFavoritePressHandler,
        onEditPress: onEditPressHandler,
        isOwner,
        mapPreviewUri,
        participantsPreviewData,
    };
};
