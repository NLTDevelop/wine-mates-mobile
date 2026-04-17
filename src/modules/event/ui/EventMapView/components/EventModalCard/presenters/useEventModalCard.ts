import { useMemo } from 'react';
import { IEvent } from '@/entities/events/types/IEvent';
import { formatEventDate } from '@/utils';

interface IUseEventModalCardProps {
    event: IEvent;
}

export const useEventModalCard = ({ event }: IUseEventModalCardProps) => {
    const { month, day } = useMemo(() => formatEventDate(event.eventDate), [event.eventDate]);

    return {
        month,
        day,
    };
};
