import { IEventDetail } from '@/entities/events/types/IEvent';
import { TastingType } from '@/entities/events/enums/TastingType';
import { useUiContext } from '@/UIProvider';
import { useLocationPermission } from '@/hooks/useLocationPermission';

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

    return { detailsData, wineSetItems };
};
