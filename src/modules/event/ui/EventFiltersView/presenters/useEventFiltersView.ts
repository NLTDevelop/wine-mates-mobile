import { useCallback, useMemo, useState } from 'react';
import { DateData } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { format, isValid, parseISO } from 'date-fns';
import { eventsModel } from '@/entities/events/EventsModel';
import { IEventFilters } from '@/modules/event/types/IEventFilters';
import { IRadiusOption } from '@/modules/event/ui/EventFiltersView/types/IRadiusOption';

const DATE_API_FORMAT = 'yyyy-MM-dd';
const DATE_DISPLAY_FORMAT = 'dd.MM.yyyy';
const RADIUS_OPTIONS = [1, 5, 10, 50];

const parseDate = (value?: string) => {
    if (!value) {
        return null;
    }

    const parsedDate = parseISO(value);

    if (!isValid(parsedDate)) {
        return null;
    }

    return parsedDate;
};

export const useEventFiltersView = () => {
    const modelFilters = eventsModel.eventFilters;
    const initialFilters: IEventFilters = {
        radiusKm: modelFilters.radiusKm,
        eventDate: modelFilters.eventDate,
    };
    const initialDate = parseDate(initialFilters.eventDate);

    const [selectedRadiusKm, setSelectedRadiusKm] = useState<number | undefined>(initialFilters.radiusKm);
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(
        initialDate ? format(initialDate, DATE_API_FORMAT) : format(new Date(), DATE_API_FORMAT),
    );

    const onSyncFilters = useCallback((nextFilters: IEventFilters) => {
        eventsModel.setEventFilters(nextFilters);
    }, []);

    const onOpenCalendar = useCallback(() => {
        setIsCalendarVisible(true);
    }, []);

    const onCloseCalendar = useCallback(() => {
        setIsCalendarVisible(false);
    }, []);

    const onSelectRadius = useCallback((value: number) => {
        const nextRadiusKm = selectedRadiusKm === value ? undefined : value;
        setSelectedRadiusKm(nextRadiusKm);
        const nextFilters: IEventFilters = {};

        if (typeof nextRadiusKm === 'number') {
            nextFilters.radiusKm = nextRadiusKm;
        }

        if (selectedDate) {
            nextFilters.eventDate = format(selectedDate, DATE_API_FORMAT);
        }

        onSyncFilters(nextFilters);
    }, [onSyncFilters, selectedDate, selectedRadiusKm]);

    const getRadiusOption = useCallback((value: number): IRadiusOption => {
        return {
            value,
            isSelected: selectedRadiusKm === value,
            onPress: () => onSelectRadius(value),
        };
    }, [onSelectRadius, selectedRadiusKm]);

    const radiusOption1 = useMemo(() => {
        return getRadiusOption(RADIUS_OPTIONS[0]);
    }, [getRadiusOption]);

    const radiusOption5 = useMemo(() => {
        return getRadiusOption(RADIUS_OPTIONS[1]);
    }, [getRadiusOption]);

    const radiusOption10 = useMemo(() => {
        return getRadiusOption(RADIUS_OPTIONS[2]);
    }, [getRadiusOption]);

    const radiusOption50 = useMemo(() => {
        return getRadiusOption(RADIUS_OPTIONS[3]);
    }, [getRadiusOption]);

    const onDayPress = useCallback((item: DateData) => {
        const parsedDate = parseDate(item.dateString);

        if (!parsedDate) {
            return;
        }

        const nextFilters: IEventFilters = {};

        if (typeof selectedRadiusKm === 'number') {
            nextFilters.radiusKm = selectedRadiusKm;
        }

        const selectedDateKey = selectedDate ? format(selectedDate, DATE_API_FORMAT) : '';
        const isSameDateSelected = selectedDateKey === item.dateString;

        if (isSameDateSelected) {
            setSelectedDate(null);
            onSyncFilters(nextFilters);
            return;
        }

        setCurrentMonth(item.dateString);
        setSelectedDate(parsedDate);
        nextFilters.eventDate = item.dateString;
        onSyncFilters(nextFilters);
    }, [onSyncFilters, selectedDate, selectedRadiusKm]);

    const onMonthChange = useCallback((month: DateData) => {
        setCurrentMonth(month.dateString);
    }, []);

    const onReset = useCallback(() => {
        setSelectedRadiusKm(undefined);
        setSelectedDate(null);
        setCurrentMonth(format(new Date(), DATE_API_FORMAT));
        onSyncFilters({});
    }, [onSyncFilters]);

    const markedDates = useMemo<MarkedDates>(() => {
        if (!selectedDate) {
            return {};
        }

        const dayKey = format(selectedDate, DATE_API_FORMAT);

        return {
            [dayKey]: {
                selected: true,
                startingDay: true,
                endingDay: true,
            },
        };
    }, [selectedDate]);

    const selectedDateText = useMemo(() => {
        if (!selectedDate) {
            return '';
        }

        return format(selectedDate, DATE_DISPLAY_FORMAT);
    }, [selectedDate]);

    const isResetDisabled = useMemo(() => {
        return !selectedDate && typeof selectedRadiusKm !== 'number';
    }, [selectedDate, selectedRadiusKm]);

    return {
        currentMonth,
        markedDates,
        selectedDateText,
        radiusOption1,
        radiusOption5,
        radiusOption10,
        radiusOption50,
        isCalendarVisible,
        isResetDisabled,
        onOpenCalendar,
        onCloseCalendar,
        onDayPress,
        onMonthChange,
        onReset,
    };
};
