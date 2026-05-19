interface IEventDateTimeValue {
    date: string;
    time: string;
}

const formatDateToApi = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const formatDateToUtcApi = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const formatTimeToApi = (hours: number, minutes: number, seconds = 0) => {
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const parseDateParts = (value: string) => {
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

    return { year, month, day };
};

const parseTimeParts = (value: string) => {
    const parts = value.split(':');
    if (parts.length < 2) {
        return null;
    }

    const [hoursString, minutesString, secondsString = '0'] = parts;
    const hours = Number(hoursString);
    const minutes = Number(minutesString);
    const seconds = Number(secondsString);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes) || !Number.isFinite(seconds)) {
        return null;
    }

    return { hours, minutes, seconds };
};

export const convertLocalEventDateTimeToUtc = (date: string, time: string): IEventDateTimeValue => {
    const dateParts = parseDateParts(date);
    const timeParts = parseTimeParts(time);

    if (!dateParts || !timeParts) {
        return { date, time };
    }

    const localDate = new Date(
        dateParts.year,
        dateParts.month - 1,
        dateParts.day,
        timeParts.hours,
        timeParts.minutes,
        timeParts.seconds,
    );

    return {
        date: formatDateToUtcApi(localDate),
        time: formatTimeToApi(localDate.getUTCHours(), localDate.getUTCMinutes(), localDate.getUTCSeconds()),
    };
};

export const getUtcEventDateTime = (date: string, time: string) => {
    const dateParts = parseDateParts(date);
    const timeParts = parseTimeParts(time);

    if (!dateParts || !timeParts) {
        return null;
    }

    return new Date(Date.UTC(
        dateParts.year,
        dateParts.month - 1,
        dateParts.day,
        timeParts.hours,
        timeParts.minutes,
        timeParts.seconds,
    ));
};

export const convertUtcEventDateTimeToLocal = (date: string, time: string): IEventDateTimeValue => {
    const localDate = getUtcEventDateTime(date, time);

    if (!localDate) {
        return { date, time };
    }

    return {
        date: formatDateToApi(localDate),
        time: formatTimeToApi(localDate.getHours(), localDate.getMinutes(), localDate.getSeconds()),
    };
};
