interface IPrepareEventDateTimeLabelParams {
    date?: Date | null;
    time?: string | null;
    locale?: string | null;
}

export const prepareEventDateTimeLabel = ({
    date,
    time,
    locale,
}: IPrepareEventDateTimeLabelParams) => {
    if (!date) {
        return time || '';
    }

    const dateLabel = new Intl.DateTimeFormat(locale || 'en', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    })
        .format(date)
        .replace('.', '');

    if (!time) {
        return dateLabel;
    }

    const [hoursPart, minutesPart] = time.split(':');
    const hours = Number(hoursPart);
    const minutes = Number(minutesPart);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return `${dateLabel} · ${time}`;
    }

    const dateWithTime = new Date(date);
    dateWithTime.setHours(hours, minutes, 0, 0);
    const timeLabel = new Intl.DateTimeFormat(locale || 'en', {
        hour: 'numeric',
        minute: '2-digit',
    }).format(dateWithTime);

    return `${dateLabel} · ${timeLabel}`;
};
