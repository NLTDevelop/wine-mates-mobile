interface IPrepareEventDateTimeLabelParams {
    date?: Date | null;
    time?: string | null;
    endDate?: Date | null;
    endTime?: string | null;
    locale?: string | null;
}

const normalizeLabel = (value: string) => {
    const label = value.replace(/\./g, '');

    return label.charAt(0).toUpperCase() + label.slice(1);
};

const getIsUkrainianLocale = (locale?: string | null) => {
    return (locale || '').toLowerCase().startsWith('uk');
};

const formatDateLabel = (date: Date, locale?: string | null) => {
    const currentLocale = locale || 'en';
    const weekday = new Intl.DateTimeFormat(currentLocale, { weekday: 'short' }).format(date);
    const day = new Intl.DateTimeFormat(currentLocale, { day: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat(currentLocale, { month: 'short' }).format(date);

    if (getIsUkrainianLocale(locale)) {
        return normalizeLabel(`${weekday}, ${day} ${month}`);
    }

    return normalizeLabel(`${weekday}, ${month} ${day}`);
};

const formatTimeLabel = (date: Date, time?: string | null, locale?: string | null) => {
    if (!time) {
        return '';
    }

    const [hoursPart, minutesPart] = time.split(':');
    const hours = Number(hoursPart);
    const minutes = Number(minutesPart);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return time;
    }

    const dateWithTime = new Date(date);
    dateWithTime.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat(locale || 'en', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(dateWithTime);
};

const formatDateTimeLabel = (date: Date, time?: string | null, locale?: string | null) => {
    const dateLabel = formatDateLabel(date, locale);
    const timeLabel = formatTimeLabel(date, time, locale);

    return timeLabel ? `${dateLabel} ${timeLabel}` : dateLabel;
};

export const prepareEventDateTimeLabel = ({
    date,
    time,
    endDate,
    endTime,
    locale,
}: IPrepareEventDateTimeLabelParams) => {
    if (!date) {
        return time || '';
    }

    const startLabel = formatDateTimeLabel(date, time, locale);

    if (!endDate && !endTime) {
        return startLabel;
    }

    if (!endDate && endTime) {
        return `${startLabel} – ${endTime}`;
    }

    const endLabel = formatDateTimeLabel(endDate || date, endTime, locale);

    return `${startLabel} – ${endLabel}`;
};
