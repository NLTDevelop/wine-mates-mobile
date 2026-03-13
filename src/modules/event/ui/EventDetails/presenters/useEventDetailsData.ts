import { useState, useMemo } from 'react';
import { IEventDetail } from '@/entities/events/types/IEvent';
import { useUiContext } from '@/UIProvider';

export const useEventDetailsData = (eventDetail: IEventDetail | null) => {
    const { t } = useUiContext();
    const [maxLabelWidth, setMaxLabelWidth] = useState(0);

    const detailsData = useMemo(() => {
        if (!eventDetail) return [];
        return [
            { key: 'theme', label: t('eventDetails.theme'), value: eventDetail.theme },
            { key: 'restaurant', label: t('eventDetails.restaurant'), value: eventDetail.restaurant },
            { key: 'location', label: t('eventDetails.location'), value: eventDetail.location },
            { key: 'date', label: t('eventDetails.date'), value: eventDetail.date },
            { key: 'time', label: t('eventDetails.time'), value: `${eventDetail.startTime} - ${eventDetail.endTime}` },
            { key: 'price', label: t('eventDetails.price'), value: `₴${eventDetail.price}` },
            { key: 'speaker', label: t('eventDetails.speaker'), value: eventDetail.speaker },
            { key: 'distance', label: t('eventDetails.distance'), value: eventDetail.distance },
            { key: 'language', label: t('eventDetails.language'), value: eventDetail.language },
            { key: 'seats', label: t('eventDetails.seats'), value: eventDetail.seats.toString() },
        ];
    }, [eventDetail, t]);

    const onLabelLayout = (width: number) => {
        setMaxLabelWidth(prev => Math.max(prev, width));
    };

    return { detailsData, maxLabelWidth, onLabelLayout };
};
