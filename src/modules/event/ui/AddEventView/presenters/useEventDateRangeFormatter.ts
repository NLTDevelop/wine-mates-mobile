import { useMemo } from 'react';
import { format } from 'date-fns';
import { ILocalization } from '@/UIProvider/localization/ILocalization';

interface IUseEventDateRangeFormatterProps {
    startDate: string;
    endDate: string;
    t: ILocalization['t'];
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

const getFormattedDate = (value: string) => {
    const localDate = getLocalDateFromApi(value);
    if (!localDate) {
        return '';
    }

    return format(localDate, 'dd/MM/yyyy');
};

export const useEventDateRangeFormatter = ({ startDate, endDate, t }: IUseEventDateRangeFormatterProps) => {
    const formattedValue = useMemo(() => {
        if (!startDate && !endDate) {
            return t('event.eventDate');
        }

        const formattedStartDate = getFormattedDate(startDate);
        const formattedEndDate = getFormattedDate(endDate);

        if (!formattedStartDate || !formattedEndDate || startDate === endDate) {
            return formattedStartDate || formattedEndDate || t('event.eventDate');
        }

        return `${formattedStartDate} - ${formattedEndDate}`;
    }, [endDate, startDate, t]);

    return { formattedValue };
};
