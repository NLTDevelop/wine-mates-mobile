import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IEvent } from '@/entities/events/types/IEvent';
import { EventType } from '@/entities/events/enums/EventType';
import { localization } from '@/UIProvider/localization/Localization';
import { config } from '@/config';

interface IUseEventCardProps {
    event: IEvent;
    onReadMorePress?: (eventId: number) => void;
    onFavoritePress?: (eventId: number) => void;
}

const NAVIGATION_DEBOUNCE_MS = 260;
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

export const useEventCard = ({
    event,
    onReadMorePress,
    onFavoritePress
}: IUseEventCardProps) => {
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
