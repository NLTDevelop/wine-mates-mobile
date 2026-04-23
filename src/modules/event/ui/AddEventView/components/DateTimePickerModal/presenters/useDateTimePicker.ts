import { useCallback, useState } from 'react';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { toastService } from '@/libs/toast/toastService';

type PickerMode = 'date' | 'time';

interface IUseDateTimePickerProps {
    onDateSelect: (date: Date) => void;
    onTimeSelect: (date: Date) => void;
    selectedEventDate: string;
    selectedEventTime: string;
    t: ILocalization['t'];
}

const getStartOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

const isSameLocalDate = (firstDate: Date, secondDate: Date) => {
    return (
        firstDate.getFullYear() === secondDate.getFullYear()
        && firstDate.getMonth() === secondDate.getMonth()
        && firstDate.getDate() === secondDate.getDate()
    );
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

const getTimeFromSavedTime = (savedTime: string, baseDate: Date) => {
    const date = new Date(baseDate);
    if (!savedTime) {
        return date;
    }

    const timeParts = savedTime.split(':');
    if (timeParts.length < 2) {
        return date;
    }

    const [hoursString, minutesString] = timeParts;
    const hours = Number(hoursString);
    const minutes = Number(minutesString);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
        return date;
    }

    date.setHours(hours, minutes, 0, 0);
    return date;
};

const getNormalizedTime = (time: Date, eventDate: Date) => {
    const now = new Date();
    const normalizedTime = new Date(time);

    if (isSameLocalDate(eventDate, now) && normalizedTime < now) {
        return now;
    }

    return normalizedTime;
};

const isTimeInPastForDate = (timeString: string, eventDate: Date) => {
    if (!timeString) {
        return false;
    }

    const timeParts = timeString.split(':');
    if (timeParts.length < 2) {
        return false;
    }

    const [hoursString, minutesString] = timeParts;
    const hours = Number(hoursString);
    const minutes = Number(minutesString);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
        return false;
    }

    const candidate = new Date(eventDate);
    candidate.setHours(hours, minutes, 0, 0);

    if (!isSameLocalDate(eventDate, new Date())) {
        return false;
    }

    return candidate < new Date();
};

export const useDateTimePicker = ({
    onDateSelect,
    onTimeSelect,
    selectedEventDate,
    selectedEventTime,
    t,
}: IUseDateTimePickerProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [mode, setMode] = useState<PickerMode>('date');
    const [pickerDate, setPickerDate] = useState(new Date());
    const isTimePickerDisabled = !selectedEventDate;

    const openDatePicker = useCallback(() => {
        const today = getStartOfToday();
        const initialDate = selectedEventDate ? getDateFromSavedDate(selectedEventDate) : today;

        setMode('date');
        setPickerDate(initialDate);
        setIsVisible(true);
    }, [selectedEventDate]);

    const openTimePicker = useCallback(() => {
        if (!selectedEventDate) {
            return;
        }

        const savedEventDate = getDateFromSavedDate(selectedEventDate);
        const savedTime = getTimeFromSavedTime(selectedEventTime, savedEventDate);
        const normalizedTime = getNormalizedTime(savedTime, savedEventDate);

        setMode('time');
        setPickerDate(normalizedTime);
        setIsVisible(true);
    }, [selectedEventDate, selectedEventTime]);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onConfirm = useCallback(() => {
        if (mode === 'date') {
            const today = getStartOfToday();

            if (pickerDate < today) {
                toastService.showError(t('event.pastDateError'));
                setPickerDate(today);
                return;
            }
            onDateSelect(pickerDate);

            if (isTimeInPastForDate(selectedEventTime, pickerDate)) {
                onTimeSelect(new Date());
            }
        } else {
            const savedEventDate = getDateFromSavedDate(selectedEventDate);
            const normalizedTime = getNormalizedTime(pickerDate, savedEventDate);
            onTimeSelect(normalizedTime);
        }
        setIsVisible(false);
    }, [mode, onDateSelect, onTimeSelect, pickerDate, selectedEventDate, selectedEventTime, t]);

    const onDateChange = useCallback((date: Date) => {
        setPickerDate(date);
    }, []);

    const minimumDate = mode === 'date'
        ? getStartOfToday()
        : (() => {
            const now = new Date();
            const savedEventDate = getDateFromSavedDate(selectedEventDate);

            if (isSameLocalDate(savedEventDate, now)) {
                return now;
            }

            return getStartOfToday();
        })();

    return {
        isVisible,
        isTimePickerDisabled,
        mode,
        pickerDate,
        minimumDate,
        openDatePicker,
        openTimePicker,
        onClose,
        onConfirm,
        onDateChange,
    };
};
