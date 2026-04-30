import { useMemo } from 'react';
import { format } from 'date-fns';

interface IUseEventDateTimeFormatterProps {
    value: string;
    mode: 'date' | 'time';
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

export const useEventDateTimeFormatter = ({ value, mode }: IUseEventDateTimeFormatterProps) => {
    const formattedValue = useMemo(() => {
        if (!value) return '';

        if (mode === 'time') {
            return value;
        }

        try {
            const localDate = getLocalDateFromApi(value);
            if (!localDate) {
                return '';
            }

            return format(localDate, 'dd/MM/yyyy');
        } catch {
            return '';
        }
    }, [mode, value]);

    return { formattedValue };
};
