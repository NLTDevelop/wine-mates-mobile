import { useCallback, useMemo, useState } from 'react';
import { DateData } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { format, isValid, parseISO } from 'date-fns';
import { eventsModel } from '@/entities/events/EventsModel';
import { Sex } from '@/entities/events/enums/Sex';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
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

interface IProps {
    t: ILocalization['t'];
}

export const useEventFiltersView = ({ t }: IProps) => {
    const modelFilters = eventsModel.eventFilters;
    const initialFilters: IEventFilters = {
        radiusKm: modelFilters.radiusKm,
        eventDate: modelFilters.eventDate,
        sex: modelFilters.sex,
    };
    const initialDate = parseDate(initialFilters.eventDate);

    const [selectedRadiusKm, setSelectedRadiusKm] = useState<number | undefined>(initialFilters.radiusKm);
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
    const [selectedSex, setSelectedSex] = useState<Sex | undefined>(initialFilters.sex);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [isSexPickerVisible, setIsSexPickerVisible] = useState(false);
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

    const onOpenSexPicker = useCallback(() => {
        setIsSexPickerVisible(true);
    }, []);

    const onCloseSexPicker = useCallback(() => {
        setIsSexPickerVisible(false);
    }, []);

    const getPreparedFilters = useCallback((radiusKm?: number, date?: Date | null, sex?: Sex) => {
        const nextFilters: IEventFilters = {};

        if (typeof radiusKm === 'number') {
            nextFilters.radiusKm = radiusKm;
        }

        if (date) {
            nextFilters.eventDate = format(date, DATE_API_FORMAT);
        }

        if (sex) {
            nextFilters.sex = sex;
        }

        return nextFilters;
    }, []);

    const onSelectRadius = useCallback((value: number) => {
        const nextRadiusKm = selectedRadiusKm === value ? undefined : value;
        setSelectedRadiusKm(nextRadiusKm);
        const nextFilters = getPreparedFilters(nextRadiusKm, selectedDate, selectedSex);
        onSyncFilters(nextFilters);
    }, [getPreparedFilters, onSyncFilters, selectedDate, selectedRadiusKm, selectedSex]);

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

        const selectedDateKey = selectedDate ? format(selectedDate, DATE_API_FORMAT) : '';
        const isSameDateSelected = selectedDateKey === item.dateString;

        if (isSameDateSelected) {
            setSelectedDate(null);
            const nextFilters = getPreparedFilters(selectedRadiusKm, null, selectedSex);
            onSyncFilters(nextFilters);
            return;
        }

        setCurrentMonth(item.dateString);
        setSelectedDate(parsedDate);
        const nextFilters = getPreparedFilters(selectedRadiusKm, parsedDate, selectedSex);
        onSyncFilters(nextFilters);
    }, [getPreparedFilters, onSyncFilters, selectedDate, selectedRadiusKm, selectedSex]);

    const onSelectSex = useCallback((sex: Sex) => {
        const nextSex = selectedSex === sex ? undefined : sex;
        setSelectedSex(nextSex);
        const nextFilters = getPreparedFilters(selectedRadiusKm, selectedDate, nextSex);
        onSyncFilters(nextFilters);
        setIsSexPickerVisible(false);
    }, [getPreparedFilters, onSyncFilters, selectedDate, selectedRadiusKm, selectedSex]);

    const onMonthChange = useCallback((month: DateData) => {
        setCurrentMonth(month.dateString);
    }, []);

    const onReset = useCallback(() => {
        setSelectedRadiusKm(undefined);
        setSelectedDate(null);
        setSelectedSex(undefined);
        setIsSexPickerVisible(false);
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
        return !selectedDate && typeof selectedRadiusKm !== 'number' && !selectedSex;
    }, [selectedDate, selectedRadiusKm, selectedSex]);

    const selectedSexText = useMemo(() => {
        if (selectedSex === Sex.Men) {
            return t('eventFilters.men');
        }

        if (selectedSex === Sex.Women) {
            return t('eventFilters.women');
        }

        if (selectedSex === Sex.All) {
            return t('eventFilters.all');
        }

        return '';
    }, [selectedSex, t]);

    return {
        currentMonth,
        markedDates,
        selectedDateText,
        selectedSexText,
        selectedSex,
        radiusOption1,
        radiusOption5,
        radiusOption10,
        radiusOption50,
        isCalendarVisible,
        isSexPickerVisible,
        isResetDisabled,
        onOpenCalendar,
        onCloseCalendar,
        onOpenSexPicker,
        onCloseSexPicker,
        onDayPress,
        onMonthChange,
        onSelectSex,
        onReset,
    };
};
