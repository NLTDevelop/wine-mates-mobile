import { MarkedDates } from 'react-native-calendars/src/types';

const formatDateToLocalApi = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getDateFromSavedDate = (savedDate: string) => {
    if (!savedDate) {
        return new Date();
    }

    const dateParts = savedDate.split('-');
    if (dateParts.length !== 3) {
        return new Date();
    }

    const [yearString, monthString, dayString] = dateParts;
    const year = Number(yearString);
    const month = Number(monthString);
    const day = Number(dayString);

    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
        return new Date();
    }

    return new Date(year, month - 1, day);
};

export const getRangeMarkedDates = (startDate: string, endDate: string): MarkedDates => {
    if (!startDate && !endDate) {
        return {};
    }

    if (!startDate || !endDate || startDate === endDate) {
        const dayKey = startDate || endDate;

        return {
            [dayKey]: {
                selected: true,
                startingDay: true,
                endingDay: true,
            },
        };
    }

    const range: MarkedDates = {};
    const start = getDateFromSavedDate(startDate);
    const end = getDateFromSavedDate(endDate);
    const current = new Date(start);

    while (current.getTime() <= end.getTime()) {
        const dayKey = formatDateToLocalApi(current);
        range[dayKey] = {
            selected: true,
            startingDay: dayKey === startDate,
            endingDay: dayKey === endDate,
        };
        current.setDate(current.getDate() + 1);
    }

    return range;
};
