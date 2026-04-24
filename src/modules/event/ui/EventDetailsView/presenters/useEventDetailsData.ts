import { IEventDetail } from '@/entities/events/types/IEvent';
import { TastingType } from '@/entities/events/enums/TastingType';
import { EventType } from '@/entities/events/enums/EventType';
import { useUiContext } from '@/UIProvider';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { config } from '@/config';
import { IEventDetailsPreviewData } from '../types/IEventDetailsPreviewData';

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

export const useEventDetailsData = (eventDetail: IEventDetail | null) => {
    const { t, locale } = useUiContext();
    const { userLocation } = useLocationPermission();

    const getValueOrDash = (value?: string | number | null) => {
        if (value === null || value === undefined || value === '') {
            return '-';
        }

        return String(value);
    };

    const formatLocalizedDate = (value?: string) => {
        if (!value) {
            return '-';
        }

        try {
            const date = new Date(`${value}T00:00:00`);
            return new Intl.DateTimeFormat(locale || 'en', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }).format(date);
        } catch {
            return value;
        }
    };

    const formatLocalizedTime = (value?: string) => {
        if (!value) {
            return '';
        }

        const [hours, minutes] = value.split(':');
        if (!hours || !minutes) {
            return value;
        }

        try {
            const date = new Date();
            date.setHours(Number(hours), Number(minutes), 0, 0);
            return new Intl.DateTimeFormat(locale || 'en', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }).format(date);
        } catch {
            return `${hours}:${minutes}`;
        }
    };

    const formatPrice = (price: number, currency?: string) => {
        const symbolByCurrency: Record<string, string> = {
            UAH: '₴',
            USD: '$',
            EUR: '€',
        };

        const symbol = symbolByCurrency[(currency || '').toUpperCase()] || '₴';
        return `${symbol}${price}`;
    };

    const calculateDistanceKm = (
        fromLatitude: number,
        fromLongitude: number,
        toLatitude: number,
        toLongitude: number,
    ) => {
        const toRadians = (value: number) => (value * Math.PI) / 180;
        const EARTH_RADIUS_KM = 6371;
        const deltaLatitude = toRadians(toLatitude - fromLatitude);
        const deltaLongitude = toRadians(toLongitude - fromLongitude);
        const fromLatitudeRad = toRadians(fromLatitude);
        const toLatitudeRad = toRadians(toLatitude);

        const haversine =
            Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
            Math.cos(fromLatitudeRad) *
                Math.cos(toLatitudeRad) *
                Math.sin(deltaLongitude / 2) *
                Math.sin(deltaLongitude / 2);

        const arc = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

        return EARTH_RADIUS_KM * arc;
    };

    const formatDistanceFromYou = (distanceKm: number) => {
        const roundedDistance = Math.max(1, Math.round(distanceKm));
        return t('eventDetails.kmFromYou', { distance: roundedDistance });
    };

    const formatDistanceFallback = (distance: IEventDetail['distance'], distanceKm: IEventDetail['distanceKm']) => {
        const normalizedDistance = distanceKm ?? distance;

        if (normalizedDistance === null || normalizedDistance === undefined || normalizedDistance === '') {
            return '-';
        }

        if (typeof normalizedDistance === 'number') {
            return t('eventDetails.kmOnly', { distance: normalizedDistance });
        }

        const distanceText = String(normalizedDistance).trim();
        if (!distanceText) {
            return '-';
        }

        return distanceText;
    };

    const formatDistance = (
        distance: IEventDetail['distance'],
        distanceKm: IEventDetail['distanceKm'],
        latitude: number,
        longitude: number,
    ) => {
        if (userLocation) {
            const calculatedDistanceKm = calculateDistanceKm(
                userLocation.latitude,
                userLocation.longitude,
                latitude,
                longitude,
            );

            if (Number.isFinite(calculatedDistanceKm)) {
                return formatDistanceFromYou(calculatedDistanceKm);
            }
        }

        return formatDistanceFallback(distance, distanceKm);
    };

    const formatTastingType = (value?: TastingType) => {
        if (!value) {
            return '-';
        }

        if (value === TastingType.Blind) {
            return t('event.tastingTypeBlind');
        }

        if (value === TastingType.Regular) {
            return t('event.tastingTypeRegular');
        }

        return '-';
    };

    const detailsData = (() => {
        if (!eventDetail) {
            return [];
        }

        const dateValue = eventDetail.eventDate || eventDetail.date;
        const timeStartValue = eventDetail.eventTime || eventDetail.startTime;
        const timeEndValue = eventDetail.endTime;
        const formattedTimeStart = formatLocalizedTime(timeStartValue);
        const formattedTimeEnd = formatLocalizedTime(timeEndValue);
        const formattedTime = formattedTimeStart && formattedTimeEnd
            ? `${formattedTimeStart} - ${formattedTimeEnd}`
            : formattedTimeStart || '-';

        const confirmationValue = eventDetail.requiresConfirmation
            ? t('eventDetails.confirmationRequired')
            : t('eventDetails.noConfirmation');

        return [
            { key: 'theme', label: t('eventDetails.theme'), value: getValueOrDash(eventDetail.theme) },
            { key: 'description', label: t('eventDetails.description'), value: getValueOrDash(eventDetail.description) },
            { key: 'restaurant', label: t('eventDetails.restaurant'), value: getValueOrDash(eventDetail.restaurantName || eventDetail.restaurant) },
            { key: 'location', label: t('eventDetails.location'), value: getValueOrDash(eventDetail.locationLabel || eventDetail.location) },
            { key: 'date', label: t('eventDetails.date'), value: formatLocalizedDate(dateValue) },
            { key: 'time', label: t('eventDetails.time'), value: formattedTime },
            { key: 'tastingType', label: t('event.tastingType'), value: formatTastingType(eventDetail.tastingType) },
            { key: 'price', label: t('eventDetails.price'), value: formatPrice(eventDetail.price, eventDetail.currency) },
            { key: 'speaker', label: t('eventDetails.speaker'), value: getValueOrDash(eventDetail.speakerName || eventDetail.speaker) },
            {
                key: 'distance',
                label: t('eventDetails.distance'),
                value: formatDistance(
                    eventDetail.distance,
                    eventDetail.distanceKm,
                    eventDetail.latitude,
                    eventDetail.longitude,
                ),
            },
            { key: 'language', label: t('eventDetails.language'), value: getValueOrDash((eventDetail.language || '').toUpperCase()) },
            { key: 'seats', label: t('eventDetails.seats'), value: getValueOrDash(eventDetail.seats) },
            { key: 'confirmation', label: t('eventDetails.confirmationAvailability'), value: confirmationValue },
        ];
    })();

    const wineSetItems = (() => {
        if (!eventDetail?.wineSet?.length) {
            return [];
        }

        return eventDetail.wineSet;
    })();

    const cardPreviewData = (() => {
        if (!eventDetail) {
            return null;
        }

        const parsedDate = eventDetail.eventDate ? new Date(eventDetail.eventDate) : null;
        const isDateValid = parsedDate && !Number.isNaN(parsedDate.getTime());
        const month = isDateValid
            ? new Intl.DateTimeFormat(locale || 'en', { month: 'short' }).format(parsedDate).replace('.', '').toUpperCase()
            : '';
        const day = isDateValid
            ? new Intl.DateTimeFormat(locale || 'en', { day: 'numeric' }).format(parsedDate)
            : '';

        const formattedDateTime = (() => {
            if (!isDateValid) {
                return eventDetail.eventTime || eventDetail.startTime || '';
            }

            const dateLabel = new Intl.DateTimeFormat(locale || 'en', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            })
                .format(parsedDate)
                .replace('.', '');

            const rawTime = eventDetail.eventTime || eventDetail.startTime;
            if (!rawTime) {
                return dateLabel;
            }

            const [hoursPart, minutesPart] = rawTime.split(':');
            const hours = Number(hoursPart);
            const minutes = Number(minutesPart);
            if (Number.isNaN(hours) || Number.isNaN(minutes)) {
                return `${dateLabel} · ${rawTime}`;
            }

            const dateWithTime = new Date(parsedDate);
            dateWithTime.setHours(hours, minutes, 0, 0);
            const timeLabel = new Intl.DateTimeFormat(locale || 'en', {
                hour: 'numeric',
                minute: '2-digit',
            }).format(dateWithTime);

            return `${dateLabel} · ${timeLabel}`;
        })();

        const priceLabel = (() => {
            const currency = eventDetail.currency;
            if (currency) {
                try {
                    return new Intl.NumberFormat(locale || 'en', {
                        style: 'currency',
                        currency,
                        maximumFractionDigits: 0,
                    }).format(eventDetail.price || 0);
                } catch {
                    return `${currency} ${eventDetail.price || 0}`;
                }
            }

            return `${eventDetail.price || 0}`;
        })();

        const eventTypeLabel = eventDetail.eventType === EventType.Parties
            ? t('event.parties')
            : t('event.tastings');
        const isPartyEvent = eventDetail.eventType === EventType.Parties;

        const mapPreviewUri = (() => {
            const params = [
                `center=${eventDetail.latitude},${eventDetail.longitude}`,
                `zoom=${STATIC_MAP_ZOOM}`,
                `size=${STATIC_MAP_SIZE}`,
                'maptype=roadmap',
                `markers=color:red|${eventDetail.latitude},${eventDetail.longitude}`,
                ...STATIC_MAP_LIGHT_STYLE_PARAMS,
            ];

            if (config.googlePlacesApiKey) {
                params.push(`key=${config.googlePlacesApiKey}`);
            }

            return `https://maps.googleapis.com/maps/api/staticmap?${params.join('&')}`;
        })();

        const previewData: IEventDetailsPreviewData = {
            month,
            day,
            formattedDateTime,
            priceLabel,
            eventTypeLabel,
            isPartyEvent,
            mapPreviewUri,
            title: eventDetail.theme || '-',
        };

        return previewData;
    })();

    return { detailsData, wineSetItems, cardPreviewData };
};
