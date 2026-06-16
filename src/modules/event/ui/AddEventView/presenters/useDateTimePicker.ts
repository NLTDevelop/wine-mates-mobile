import { useCallback, useMemo, useState } from 'react';
import { DateData } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { toastService } from '@/libs/toast/toastService';

type ActiveModal = 'calendar' | 'time' | null;
type TimeField = 'startTime' | 'endTime';

const MIN_START_TIME_OFFSET_MINUTES = 5;

interface IUseDateTimePickerProps {
    onDateRangeSelect: (startDate: Date, endDate: Date) => void;
    onStartTimeSelect: (date: Date) => void;
    onEndTimeSelect: (date: Date) => void;
    selectedEventStartDate: string;
    selectedEventEndDate: string;
    selectedEventStartTime: string;
    selectedEventEndTime: string;
    t: ILocalization['t'];
}

const getStartOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

const getMinimumEventTime = () => {
    const date = new Date();
    date.setSeconds(0, 0);
    date.setMinutes(date.getMinutes() + MIN_START_TIME_OFFSET_MINUTES);
    return date;
};

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

const isSameLocalDate = (firstDate: Date, secondDate: Date) => {
    return (
        firstDate.getFullYear() === secondDate.getFullYear()
        && firstDate.getMonth() === secondDate.getMonth()
        && firstDate.getDate() === secondDate.getDate()
    );
};

const getNormalizedTime = (time: Date, eventDate: Date) => {
    const minimumEventTime = getMinimumEventTime();
    const normalizedTime = new Date(time);

    if (isSameLocalDate(eventDate, minimumEventTime) && normalizedTime < minimumEventTime) {
        return minimumEventTime;
    }

    return normalizedTime;
};

const isFirstDateAfterSecondDate = (firstDate: string, secondDate: string) => {
    if (!firstDate || !secondDate) {
        return false;
    }

    const first = getDateFromSavedDate(firstDate);
    const second = getDateFromSavedDate(secondDate);
    return first.getTime() > second.getTime();
};

const isFirstTimeAfterSecondTime = (firstTime: string, secondTime: string, date: string) => {
    if (!firstTime || !secondTime || !date) {
        return false;
    }

    const baseDate = getDateFromSavedDate(date);
    const first = getTimeFromSavedTime(firstTime, baseDate);
    const second = getTimeFromSavedTime(secondTime, baseDate);
    return first.getTime() > second.getTime();
};

const getRangeMarkedDates = (startDate: string, endDate: string): MarkedDates => {
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

export const useDateTimePicker = ({
    onDateRangeSelect,
    onStartTimeSelect,
    onEndTimeSelect,
    selectedEventStartDate,
    selectedEventEndDate,
    selectedEventStartTime,
    selectedEventEndTime,
    t,
}: IUseDateTimePickerProps) => {
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const [pendingRangeStartDate, setPendingRangeStartDate] = useState<string | null>(null);
    const [draftStartDate, setDraftStartDate] = useState('');
    const [draftEndDate, setDraftEndDate] = useState('');
    const [timeField, setTimeField] = useState<TimeField>('startTime');
    const [pickerDate, setPickerDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(formatDateToLocalApi(new Date()));
    const isStartTimePickerDisabled = !selectedEventStartDate;
    const isEndTimePickerDisabled = !selectedEventEndDate;
    const todayKey = formatDateToLocalApi(getStartOfToday());

    const openDateRangePicker = useCallback(() => {
        const initialDate = selectedEventStartDate || todayKey;

        setPendingRangeStartDate(null);
        setDraftStartDate(selectedEventStartDate);
        setDraftEndDate(selectedEventEndDate);
        setCurrentMonth(initialDate);
        setActiveModal('calendar');
    }, [selectedEventEndDate, selectedEventStartDate, todayKey]);

    const openStartTimePicker = useCallback(() => {
        if (!selectedEventStartDate) {
            return;
        }

        const savedEventDate = getDateFromSavedDate(selectedEventStartDate);
        const savedTime = getTimeFromSavedTime(selectedEventStartTime, savedEventDate);
        const normalizedTime = getNormalizedTime(savedTime, savedEventDate);

        setTimeField('startTime');
        setPickerDate(normalizedTime);
        setActiveModal('time');
    }, [selectedEventStartDate, selectedEventStartTime]);

    const openEndTimePicker = useCallback(() => {
        if (!selectedEventEndDate) {
            return;
        }

        const savedEventDate = getDateFromSavedDate(selectedEventEndDate);
        const savedTime = getTimeFromSavedTime(selectedEventEndTime, savedEventDate);
        const normalizedTime = getNormalizedTime(savedTime, savedEventDate);

        setTimeField('endTime');
        setPickerDate(normalizedTime);
        setActiveModal('time');
    }, [selectedEventEndDate, selectedEventEndTime]);

    const onCloseCalendar = useCallback(() => {
        setActiveModal((previousValue) => {
            if (previousValue === 'calendar') {
                setPendingRangeStartDate(null);
                setDraftStartDate('');
                setDraftEndDate('');
                return null;
            }

            return previousValue;
        });
    }, []);

    const onCloseTimePicker = useCallback(() => {
        setActiveModal((previousValue) => {
            if (previousValue === 'time') {
                return null;
            }

            return previousValue;
        });
    }, []);

    const onDayPress = useCallback((item: DateData) => {
        if (isFirstDateAfterSecondDate(todayKey, item.dateString)) {
            toastService.showError(t('event.pastDateError'));
            return;
        }

        if (!pendingRangeStartDate) {
            setDraftStartDate(item.dateString);
            setDraftEndDate(item.dateString);
            setPendingRangeStartDate(item.dateString);
            setCurrentMonth(item.dateString);
            return;
        }

        if (isFirstDateAfterSecondDate(pendingRangeStartDate, item.dateString)) {
            setDraftStartDate(item.dateString);
            setDraftEndDate(pendingRangeStartDate);
        } else {
            setDraftStartDate(pendingRangeStartDate);
            setDraftEndDate(item.dateString);
        }

        setPendingRangeStartDate(null);
        setCurrentMonth(item.dateString);
    }, [
        pendingRangeStartDate,
        t,
        todayKey,
    ]);

    const onMonthChange = useCallback((month: DateData) => {
        setCurrentMonth(month.dateString);
    }, []);

    const onConfirm = useCallback(() => {
        const selectedDate = timeField === 'startTime' ? selectedEventStartDate : selectedEventEndDate;
        const savedEventDate = getDateFromSavedDate(selectedDate);
        const normalizedTime = getNormalizedTime(pickerDate, savedEventDate);

        if (timeField === 'startTime') {
            const nextStartTime = `${String(normalizedTime.getHours()).padStart(2, '0')}:${String(normalizedTime.getMinutes()).padStart(2, '0')}`;
            const isSameDate = selectedEventStartDate && selectedEventEndDate && selectedEventStartDate === selectedEventEndDate;

            onStartTimeSelect(normalizedTime);

            if (
                isSameDate
                && isFirstTimeAfterSecondTime(nextStartTime, selectedEventEndTime, selectedEventStartDate)
            ) {
                onEndTimeSelect(normalizedTime);
            }
        } else {
            const nextEndTime = `${String(normalizedTime.getHours()).padStart(2, '0')}:${String(normalizedTime.getMinutes()).padStart(2, '0')}`;
            const isSameDate = selectedEventStartDate && selectedEventEndDate && selectedEventStartDate === selectedEventEndDate;

            if (
                isSameDate
                && isFirstTimeAfterSecondTime(selectedEventStartTime, nextEndTime, selectedEventStartDate)
            ) {
                toastService.showError(t('event.invalidEndTimeError'));
                return;
            }

            onEndTimeSelect(normalizedTime);
        }

        setActiveModal(null);
    }, [
        onEndTimeSelect,
        onStartTimeSelect,
        pickerDate,
        selectedEventEndDate,
        selectedEventEndTime,
        selectedEventStartDate,
        selectedEventStartTime,
        t,
        timeField,
    ]);

    const onDateChange = useCallback((date: Date) => {
        setPickerDate(date);
    }, []);

    const onConfirmCalendar = useCallback(() => {
        const startDate = draftStartDate || selectedEventStartDate;
        const endDate = draftEndDate || selectedEventEndDate || startDate;

        if (!startDate) {
            setActiveModal(null);
            return;
        }

        onDateRangeSelect(getDateFromSavedDate(startDate), getDateFromSavedDate(endDate));
        setPendingRangeStartDate(null);
        setDraftStartDate('');
        setDraftEndDate('');
        setActiveModal(null);
    }, [draftEndDate, draftStartDate, onDateRangeSelect, selectedEventEndDate, selectedEventStartDate]);

    const calendarMinDate = todayKey;
    const calendarTitle = t('event.eventDate');

    const timePickerTitle = useMemo(() => {
        if (timeField === 'startTime') {
            return t('event.eventStartTime');
        }

        return t('event.eventEndTime');
    }, [t, timeField]);

    const minimumDate = useMemo(() => {
        const minimumEventTime = getMinimumEventTime();
        const selectedDate = timeField === 'startTime' ? selectedEventStartDate : selectedEventEndDate;
        const savedEventDate = getDateFromSavedDate(selectedDate);

        if (isSameLocalDate(savedEventDate, minimumEventTime)) {
            return minimumEventTime;
        }

        return getStartOfToday();
    }, [selectedEventEndDate, selectedEventStartDate, timeField]);

    const markedDates = useMemo(() => {
        if (activeModal === 'calendar') {
            return getRangeMarkedDates(draftStartDate, draftEndDate);
        }

        return getRangeMarkedDates(selectedEventStartDate, selectedEventEndDate);
    }, [activeModal, draftEndDate, draftStartDate, selectedEventEndDate, selectedEventStartDate]);

    return {
        isCalendarVisible: activeModal === 'calendar',
        isTimePickerVisible: activeModal === 'time',
        isStartTimePickerDisabled,
        isEndTimePickerDisabled,
        currentMonth,
        markedDates,
        calendarMinDate,
        calendarMaxDate: undefined,
        calendarTitle,
        timePickerTitle,
        mode: 'time' as const,
        pickerDate,
        minimumDate,
        openDateRangePicker,
        openStartTimePicker,
        openEndTimePicker,
        onCloseCalendar,
        onCloseTimePicker,
        onConfirmCalendar,
        onConfirm,
        onDateChange,
        onDayPress,
        onMonthChange,
    };
};
