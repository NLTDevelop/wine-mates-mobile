import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IEvent } from '@/entities/events/types/IEvent';
import { EventType } from '@/entities/events/enums/EventType';
import { localization } from '@/UIProvider/localization/Localization';

interface IUseWineEventListItemProps {
    event: IEvent;
    onReadMorePress?: (eventId: number) => void;
    onFavoritePress?: (eventId: number) => void;
}

const NAVIGATION_DEBOUNCE_MS = 260;

export const useWineEventListItem = ({
    event,
    onReadMorePress,
    onFavoritePress
}: IUseWineEventListItemProps) => {
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

        return new Intl.DateTimeFormat(localization.locale || 'en', { month: 'short' })
            .format(parsedDate)
            .replace('.', '')
            .toUpperCase();
    }, [parsedDate]);

    const day = useMemo(() => {
        if (!parsedDate) {
            return '';
        }

        return new Intl.DateTimeFormat(localization.locale || 'en', { day: 'numeric' }).format(parsedDate);
    }, [parsedDate]);

    const formattedDateTime = useMemo(() => {
        if (!parsedDate) {
            return event.eventTime || '';
        }

        const dateLabel = new Intl.DateTimeFormat(localization.locale || 'en', {
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

        const timeLabel = new Intl.DateTimeFormat(localization.locale || 'en', {
            hour: 'numeric',
            minute: '2-digit',
        }).format(dateWithTime);

        return `${dateLabel} · ${timeLabel}`;
    }, [event.eventTime, parsedDate]);

    const priceLabel = useMemo(() => {
        const locale = localization.locale || 'en';

        if (event.currency) {
            try {
                return new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: event.currency,
                    maximumFractionDigits: 0,
                }).format(event.price || 0);
            } catch {
                return `${event.currency} ${event.price}`;
            }
        }

        return `${event.price}`;
    }, [event.currency, event.price]);

    const eventTypeLabel = useMemo(() => {
        if (event.eventType === EventType.Parties) {
            return localization.t('event.parties');
        }

        return localization.t('event.tastings');
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

    return {
        month,
        day,
        formattedDateTime,
        priceLabel,
        eventTypeLabel,
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
    };
};
