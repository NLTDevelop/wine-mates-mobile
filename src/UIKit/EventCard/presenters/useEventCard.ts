import { useCallback, useMemo, useRef, useState } from 'react';
import { IEvent } from '@/entities/events/types/IEvent';
import { EventType } from '@/entities/events/enums/EventType';
import { localization } from '@/UIProvider/localization/Localization';
import { config } from '@/config';
import { userModel } from '@/entities/users/UserModel';
import { SavedEventStatus } from '@/entities/events/enums/SavedEventStatus';
import { AppliedEventStatus } from '@/entities/events/enums/AppliedEventStatus';
import Share from 'react-native-share';
import { createEventDeepLink } from '@/navigation/rootNavigator/linking';
import { toastService } from '@/libs/toast/toastService';
import { prepareEventParticipantsPreview } from '@/modules/event/utils/prepareEventParticipantsPreview';
import { convertUtcEventDateTimeToLocal } from '@/modules/event/utils/eventDateTimeUtc';

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
        const startDateTime = convertUtcEventDateTimeToLocal(
            event.eventStartDate || event.eventDate || '',
            event.eventStartTime || event.eventTime || '',
        );

        return startDateTime.date;
    }, [event.eventDate, event.eventStartDate, event.eventStartTime, event.eventTime]);

    const endDateValue = useMemo(() => {
        const endDateTime = convertUtcEventDateTimeToLocal(
            event.eventEndDate || event.eventDate || '',
            event.eventEndTime || '',
        );

        return endDateTime.date;
    }, [event.eventDate, event.eventEndDate, event.eventEndTime]);

    const startTimeValue = useMemo(() => {
        const startDateTime = convertUtcEventDateTimeToLocal(
            event.eventStartDate || event.eventDate || '',
            event.eventStartTime || event.eventTime || '',
        );

        return startDateTime.time;
    }, [event.eventDate, event.eventStartDate, event.eventStartTime, event.eventTime]);

    const endTimeValue = useMemo(() => {
        const endDateTime = convertUtcEventDateTimeToLocal(
            event.eventEndDate || event.eventDate || '',
            event.eventEndTime || '',
        );

        return endDateTime.time;
    }, [event.eventDate, event.eventEndDate, event.eventEndTime]);

    const parsedStartDate = useMemo(() => {
        if (!startDateValue) {
            return null;
        }

        const date = new Date(`${startDateValue}T00:00:00`);
        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return date;
    }, [startDateValue]);

    const parsedEndDate = useMemo(() => {
        if (!endDateValue) {
            return null;
        }

        const date = new Date(`${endDateValue}T00:00:00`);
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

        const dateLabel = startDateLabel === endDateLabel
            ? startDateLabel
            : `${startDateLabel} - ${endDateLabel}`;

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
        const symbolByCurrency: Record<string, string> = {
            UAH: '₴',
            USD: '$',
            EUR: '€',
            GBP: '£',
            PLN: 'zł',
            JPY: '¥',
            CNY: '¥',
            INR: '₹',
            KRW: '₩',
            TRY: '₺',
            RUB: '₽',
            CHF: '₣',
            SEK: 'kr',
            NOK: 'kr',
            DKK: 'kr',
            CZK: 'Kč',
            HUF: 'Ft',
            RON: 'lei',
            AMD: '֏',
        };

        const normalizedCurrency = (event.currency || '').trim().toUpperCase();
        const symbol = symbolByCurrency[normalizedCurrency] || normalizedCurrency;

        if (!symbol) {
            return `${event.price}`;
        }

        return `${event.price} ${symbol}`;
    }, [event.currency, event.price]);

    const eventTypeLabel = event.eventType === EventType.Parties
        ? localization.t('event.parties')
        : localization.t('event.tastings');

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

    const onSharePress = useCallback(async (qrCodeDataUrl: string | null) => {
        if (!eventDeepLink || !qrCodeDataUrl) {
            toastService.showError(localization.t('common.errorHappened'), localization.t('event.shareQrCodeUnavailable'));
            return;
        }

        try {
            await Share.open({
                failOnCancel: false,
                filenames: [`wine-event-${event.id}-qr.png`],
                message: `${localization.t('event.shareQrCodeMessage')}\n${eventDeepLink}`,
                title: localization.t('event.shareQrCodeTitle'),
                type: 'image/png',
                urls: [qrCodeDataUrl],
                subject: localization.t('event.shareQrCodeTitle'),
                useInternalStorage: true,
            });
        } catch (error) {
            console.warn('useEventCard -> onSharePress: ', error);
            toastService.showError(localization.t('common.errorHappened'), localization.t('common.somethingWentWrong'));
        }
    }, [event.id, eventDeepLink]);

    const onQrCodeSharePress = useCallback((qrCodeData?: string) => {
        if (!qrCodeData) {
            onSharePress(null);
            return;
        }

        onSharePress(`${QR_CODE_IMAGE_PREFIX}${qrCodeData}`);
    }, [onSharePress]);

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
