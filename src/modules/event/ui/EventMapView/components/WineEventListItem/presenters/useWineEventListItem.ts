import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IEvent } from '@/entities/events/types/IEvent';
import { EventType } from '@/entities/events/enums/EventType';
import { localization } from '@/UIProvider/localization/Localization';
import { config } from '@/config';

interface IUseWineEventListItemProps {
    event: IEvent;
    onReadMorePress?: (eventId: number) => void;
    onFavoritePress?: (eventId: number) => void;
}

const NAVIGATION_DEBOUNCE_MS = 260;
const STATIC_MAP_SIZE = '720x320';
const STATIC_MAP_ZOOM = 13;

export const useWineEventListItem = ({
    event,
    onReadMorePress,
    onFavoritePress
}: IUseWineEventListItemProps) => {
    const currentLocale = localization.locale || 'en';
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCardPressed, setIsCardPressed] = useState(false);
    const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (navigationTimeoutRef.current) {
                clearTimeout(navigationTimeoutRef.current);
            }
        };
    }, []);

    const scheduleNavigation = useCallback(() => {
        if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
        }

        navigationTimeoutRef.current = setTimeout(() => {
            onReadMorePress?.(event.id);
            navigationTimeoutRef.current = null;
        }, NAVIGATION_DEBOUNCE_MS);
    }, [event.id, onReadMorePress]);

    const navigateImmediately = useCallback(() => {
        onReadMorePress?.(event.id);
    }, [event.id, onReadMorePress]);

    const parsedDate = useMemo(() => {
        if (!event.eventDate) {
            return null;
        }

        const date = new Date(event.eventDate);
        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return date;
    }, [event.eventDate]);

    const month = useMemo(() => {
        if (!parsedDate) {
            return '';
        }

        return new Intl.DateTimeFormat(currentLocale, { month: 'short' })
            .format(parsedDate)
            .replace('.', '')
            .toUpperCase();
    }, [currentLocale, parsedDate]);

    const day = useMemo(() => {
        if (!parsedDate) {
            return '';
        }

        return new Intl.DateTimeFormat(currentLocale, { day: 'numeric' }).format(parsedDate);
    }, [currentLocale, parsedDate]);

    const formattedDateTime = useMemo(() => {
        if (!parsedDate) {
            return event.eventTime || '';
        }

        const dateLabel = new Intl.DateTimeFormat(currentLocale, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        })
            .format(parsedDate)
            .replace('.', '');

        if (!event.eventTime) {
            return dateLabel;
        }

        const [hoursPart, minutesPart] = event.eventTime.split(':');
        const hours = Number(hoursPart);
        const minutes = Number(minutesPart);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) {
            return `${dateLabel} · ${event.eventTime}`;
        }

        const dateWithTime = new Date(parsedDate);
        dateWithTime.setHours(hours, minutes, 0, 0);

        const timeLabel = new Intl.DateTimeFormat(currentLocale, {
            hour: 'numeric',
            minute: '2-digit',
        }).format(dateWithTime);

        return `${dateLabel} · ${timeLabel}`;
    }, [currentLocale, event.eventTime, parsedDate]);

    const priceLabel = useMemo(() => {
        if (event.currency) {
            try {
                return new Intl.NumberFormat(currentLocale, {
                    style: 'currency',
                    currency: event.currency,
                    maximumFractionDigits: 0,
                }).format(event.price || 0);
            } catch {
                return `${event.currency} ${event.price}`;
            }
        }

        return `${event.price}`;
    }, [currentLocale, event.currency, event.price]);

    const eventTypeLabel = event.eventType === EventType.Parties
        ? localization.t('event.parties')
        : localization.t('event.tastings');

    const isPartyEvent = useMemo(() => {
        return event.eventType === EventType.Parties;
    }, [event.eventType]);

    const onCardPress = useCallback(() => {
        setIsModalVisible(true);
    }, []);

    const onBookingPress = useCallback(() => {
        if (isModalVisible) {
            setIsModalVisible(false);
            scheduleNavigation();
            return;
        }

        navigateImmediately();
    }, [isModalVisible, navigateImmediately, scheduleNavigation]);

    const onCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const onPressIn = useCallback(() => {
        setIsCardPressed(true);
    }, []);

    const onPressOut = useCallback(() => {
        setIsCardPressed(false);
    }, []);

    const onFavoritePressHandler = useCallback(() => {
        onFavoritePress?.(event.id);
    }, [event.id, onFavoritePress]);

    const onReadMorePressHandler = useCallback(() => {
        if (isModalVisible) {
            setIsModalVisible(false);
            scheduleNavigation();
            return;
        }

        navigateImmediately();
    }, [isModalVisible, navigateImmediately, scheduleNavigation]);

    const onReadMoreFromModalContent = useCallback(() => {
        setIsModalVisible(false);
        scheduleNavigation();
    }, [scheduleNavigation]);

    const mapPreviewUri = useMemo(() => {
        const params = [
            `center=${event.latitude},${event.longitude}`,
            `zoom=${STATIC_MAP_ZOOM}`,
            `size=${STATIC_MAP_SIZE}`,
            'maptype=roadmap',
            `markers=color:red|${event.latitude},${event.longitude}`,
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
        isPartyEvent,
        isModalVisible,
        isCardPressed,
        onCardPress,
        onPressIn,
        onPressOut,
        onBookingPress,
        onCloseModal,
        onReadMorePress: onReadMorePressHandler,
        onReadMoreFromModalContent,
        onFavoritePress: onFavoritePressHandler,
        mapPreviewUri,
    };
};
