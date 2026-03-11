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
        try {
            return format(new Date(eventTime), 'HH:mm');
        } catch {
            return '';
        }
    }, [eventTime]);

    return { formattedDate, formattedTime };
};
