import { useCallback, useMemo, useState } from 'react';
import { IEvent } from '@/entities/events/types/IEvent';
import { EventType } from '@/entities/events/enums/EventType';
import { TastingType } from '@/entities/events/enums/TastingType';
import { localization } from '@/UIProvider/localization/Localization';
import { config } from '@/config';
import { userModel } from '@/entities/users/UserModel';
import { SavedEventStatus } from '@/entities/events/enums/SavedEventStatus';
import { AppliedEventStatus } from '@/entities/events/enums/AppliedEventStatus';
import { EventTastingStatus } from '@/entities/events/enums/EventTastingStatus';
import { createEventDeepLink } from '@/navigation/rootNavigator/linking';
import { toastService } from '@/libs/toast/toastService';
import { prepareEventParticipantsPreview } from '@/modules/event/utils/prepareEventParticipantsPreview';
import { convertUtcEventDateTimeToLocal } from '@/modules/event/utils/eventDateTimeUtc';
import { prepareEventShareMessage } from '@/modules/event/utils/prepareEventShareMessage';
import { createMapLink } from '@/modules/event/utils/createMapLink';
import { formatEventPrice } from '@/modules/event/utils/formatEventPrice';
import { shareEventQrCode } from '@/modules/event/utils/shareEventQrCode';
import { useEventQrCodeShare } from '@/modules/event/presenters/useEventQrCodeShare';
import { prepareEventDateTimeLabel } from '@/modules/event/utils/prepareEventDateTimeLabel';
import { getIsEventEditDisabled } from '@/modules/event/utils/getIsEventEditDisabled';

interface IUseEventCardProps {
    event: IEvent;
    appliedEventStatus?: string | null;
    onReadMorePress?: (eventId: number) => void;
    onFavoritePress?: (eventId: number) => void;
    onEditPress?: (eventId: number) => void;
    onCardPress?: (eventId: number) => void;
    locale?: string;
}

const STATIC_MAP_SIZE = '720x320';
const STATIC_MAP_ZOOM = 14;
const STATIC_MAP_LIGHT_STYLE_PARAMS = [
    'style=element:geometry|color:0xf5f5f5',
    'style=element:labels.icon|visibility:off',
    'style=feature:road|element:geometry|color:0xffffff',
    'style=feature:road.arterial|element:geometry|color:0xffffff',
    'style=feature:water|element:geometry|color:0xc9e6ff',
    'style=feature:poi|element:geometry|color:0xeeeeee',
    'style=feature:landscape|element:geometry|color:0xf5f5f5',
];
const EMPTY_FIELD = '-';
type EventStatusType = 'finished' | 'canceled';

export const useEventCard = ({
    event,
    appliedEventStatus = null,
    onReadMorePress,
    onFavoritePress,
    onEditPress,
    onCardPress,
    locale,
}: IUseEventCardProps) => {
    const currentLocale = locale || localization.locale || 'en';
    const [currentTime] = useState(() => new Date());
    const [isCardPressed, setIsCardPressed] = useState(false);

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
            return EMPTY_FIELD;
        }

        return new Intl.DateTimeFormat(currentLocale, { month: 'short' })
            .format(parsedStartDate)
            .replace('.', '')
            .toUpperCase();
    }, [currentLocale, parsedStartDate]);

    const day = useMemo(() => {
        if (!parsedStartDate) {
            return EMPTY_FIELD;
        }

        return new Intl.DateTimeFormat(currentLocale, { day: 'numeric' }).format(parsedStartDate);
    }, [currentLocale, parsedStartDate]);

    const formattedDateTime = useMemo(() => {
        if (!parsedStartDate) {
            return startTimeValue || EMPTY_FIELD;
        }

        return prepareEventDateTimeLabel({
            date: parsedStartDate,
            time: startTimeValue,
            endDate: parsedEndDate,
            endTime: endTimeValue,
            locale: currentLocale,
        });
    }, [currentLocale, endTimeValue, parsedEndDate, parsedStartDate, startTimeValue]);

    const priceLabel = useMemo(() => {
        return formatEventPrice(event.price, event.currency);
    }, [event.currency, event.price]);

    const eventTypeLabel = useMemo(() => {
        if (!event.eventType) {
            return EMPTY_FIELD;
        }

        return event.eventType === EventType.Parties
            ? localization.t('event.parties', { locale: currentLocale })
            : localization.t('event.tastings', { locale: currentLocale });
    }, [currentLocale, event.eventType]);

    const isAllSpotsFull = useMemo(() => {
        return typeof event.seats?.left === 'number' && event.seats.left <= 0;
    }, [event.seats]);

    const hasEventEnded = useMemo(() => {
        if (!endDateValue) {
            return false;
        }

        const eventEndDateTime = new Date(`${endDateValue}T${endTimeValue || '23:59:59'}`);
        if (Number.isNaN(eventEndDateTime.getTime())) {
            return false;
        }

        return currentTime.getTime() > eventEndDateTime.getTime();
    }, [currentTime, endDateValue, endTimeValue]);

    const eventStatusType = useMemo<EventStatusType | null>(() => {
        if ('status' in event && (event.status === SavedEventStatus.CANCELED || event.status === 'cancelled')) {
            return 'canceled';
        }

        if (
            ('tastingStatus' in event && event.tastingStatus === EventTastingStatus.FINISHED) ||
            ('status' in event && event.status === SavedEventStatus.FINISHED) ||
            hasEventEnded
        ) {
            return 'finished';
        }

        return null;
    }, [event, hasEventEnded]);

    const eventStatusLabel = useMemo(() => {
        if (eventStatusType === 'finished') {
            return localization.t('event.finished', { locale: currentLocale });
        }

        if (eventStatusType === 'canceled') {
            return localization.t('event.cancelled', { locale: currentLocale });
        }

        return '';
    }, [currentLocale, eventStatusType]);

    const appliedEventStatusLabel = useMemo(() => {
        if (!appliedEventStatus) {
            return '';
        }

        if (appliedEventStatus === AppliedEventStatus.ACCEPTED) {
            return localization.t('event.confirmed', { locale: currentLocale });
        }

        if (appliedEventStatus === AppliedEventStatus.PENDING) {
            return localization.t('event.pending', { locale: currentLocale });
        }

        if (appliedEventStatus === AppliedEventStatus.REJECTED) {
            return localization.t('event.rejected', { locale: currentLocale });
        }

        if (appliedEventStatus === SavedEventStatus.CANCELED) {
            return localization.t('event.cancelled', { locale: currentLocale });
        }

        return String(appliedEventStatus);
    }, [appliedEventStatus, currentLocale]);

    const isPartyEvent = useMemo(() => {
        return event.eventType === EventType.Parties;
    }, [event.eventType]);

    const participantsPreviewData = useMemo(() => {
        return prepareEventParticipantsPreview(event.participants, currentLocale);
    }, [currentLocale, event.participants]);

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

    const isOwner = useMemo(() => {
        if (!event.ownerId || !userModel.user?.id) {
            return false;
        }

        return event.ownerId === userModel.user.id;
    }, [event.ownerId]);

    const isEditDisabled = useMemo(() => {
        return getIsEventEditDisabled(event, currentTime);
    }, [currentTime, event]);

    const onEditPressHandler = useCallback(() => {
        if (isEditDisabled) {
            return;
        }

        onEditPress?.(event.id);
    }, [event.id, isEditDisabled, onEditPress]);

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
                    localization.t('common.errorHappened', { locale: currentLocale }),
                    localization.t('event.shareQrCodeUnavailable', { locale: currentLocale }),
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
                          ? localization.t('event.tastingTypeBlind', { locale: currentLocale })
                          : localization.t('event.tastingTypeRegular', { locale: currentLocale });
                const labels = {
                    title: localization.t('event.shareEventName', { locale: currentLocale }),
                    dateTime: localization.t('event.shareEventDateTime', { locale: currentLocale }),
                    meetingPlaceName: localization.t('event.shareEventMeetingPlaceName', { locale: currentLocale }),
                    location: localization.t('event.shareEventLocation', { locale: currentLocale }),
                    mapLink: localization.t('event.shareEventMap', { locale: currentLocale }),
                    price: localization.t('event.price', { locale: currentLocale }),
                    eventType: localization.t('event.eventType', { locale: currentLocale }),
                    tastingType: localization.t('event.tastingType', { locale: currentLocale }),
                };
                const message = prepareEventShareMessage({
                    intro: localization.t('event.shareQrCodeMessage', { locale: currentLocale }),
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
                const shareTitle = localization.t('event.shareQrCodeTitle', { locale: currentLocale });

                await shareEventQrCode({
                    filename: `wine-event-${event.id}-qr.png`,
                    message,
                    qrCodeImageUrl: qrCodeDataUrl,
                    title: shareTitle,
                });
            } catch (error) {
                console.warn('useEventCard -> onSharePress: ', error);
                toastService.showError(
                    localization.t('common.errorHappened', { locale: currentLocale }),
                    localization.t('common.somethingWentWrong', { locale: currentLocale }),
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
            currentLocale,
            priceLabel,
        ],
    );

    const { onQrCodeRef, onShareQrCodePress } = useEventQrCodeShare({ onShareQrPress: onSharePress });

    const hasMapPreview = useMemo(() => {
        return Number.isFinite(event.latitude) && Number.isFinite(event.longitude);
    }, [event.latitude, event.longitude]);

    const mapPreviewUri = useMemo(() => {
        if (!hasMapPreview) {
            return '';
        }

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
    }, [event.latitude, event.longitude, hasMapPreview]);

    return {
        month,
        day,
        formattedDateTime,
        priceLabel,
        eventTypeLabel,
        isAllSpotsFull,
        eventStatusLabel,
        eventStatusType,
        appliedEventStatusLabel,
        isPartyEvent,
        isCardPressed,
        onCardPress: onCardPressHandler,
        onPressIn,
        onPressOut,
        onReadMorePress: onReadMorePressHandler,
        onQrCodeRef,
        onShareIconPress: onShareQrCodePress,
        eventDeepLink,
        onFavoritePress: onFavoritePressHandler,
        onEditPress: onEditPressHandler,
        isEditDisabled,
        isOwner,
        hasMapPreview,
        mapPreviewUri,
        participantsPreviewData,
    };
};
