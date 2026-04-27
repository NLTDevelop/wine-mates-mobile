import { useMemo } from 'react';
import { format } from 'date-fns';

interface IUseEventDateTimeFormatterProps {
    eventDate: string;
    eventTime: string;
}

const getLocalDateFromApi = (value: string) => {
    const parts = value.split('-');
    if (parts.length !== 3) {
        return null;
    }

    const [yearString, monthString, dayString] = parts;
    const year = Number(yearString);
    const month = Number(monthString);
    const day = Number(dayString);

    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
        return null;
    }

    return new Date(year, month - 1, day);
};

export const useEventDateTimeFormatter = ({ eventDate, eventTime }: IUseEventDateTimeFormatterProps) => {
    const formattedDate = useMemo(() => {
        if (!eventDate) return '';
        try {
            const localDate = getLocalDateFromApi(eventDate);
            if (!localDate) {
                return '';
            }

            return format(localDate, 'dd/MM/yyyy');
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
