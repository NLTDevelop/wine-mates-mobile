import { useMemo } from 'react';
import { format } from 'date-fns';

interface IUseEventDateTimeFormatterProps {
    eventDate: string;
    eventTime: string;
}

export const useEventDateTimeFormatter = ({ eventDate, eventTime }: IUseEventDateTimeFormatterProps) => {
    const formattedDate = useMemo(() => {
        if (!eventDate) return '';
        try {
            return format(new Date(eventDate), 'dd/MM/yyyy');
        } catch {
            return '';
        }
    }, [eventDate]);

    const formattedTime = useMemo(() => {
        if (!eventTime) return '';
        return eventTime;
    }, [eventTime]);

    return { formattedDate, formattedTime };
};
