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
const MIN_AGE_LIMIT = 18;
const MAX_AGE_LIMIT = 80;

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
        minAge: modelFilters.minAge,
        maxAge: modelFilters.maxAge,
    };
    const initialDate = parseDate(initialFilters.eventDate);
    const initialMinAge = initialFilters.minAge ?? MIN_AGE_LIMIT;
    const initialMaxAge = initialFilters.maxAge ?? MAX_AGE_LIMIT;

    const [selectedRadiusKm, setSelectedRadiusKm] = useState<number | undefined>(initialFilters.radiusKm);
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
    const [selectedSex, setSelectedSex] = useState<Sex | undefined>(initialFilters.sex);
    const [selectedSexDraft, setSelectedSexDraft] = useState<Sex | undefined>(initialFilters.sex);
    const [selectedMinAge, setSelectedMinAge] = useState<number>(initialMinAge);
    const [selectedMaxAge, setSelectedMaxAge] = useState<number>(initialMaxAge);
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
        setSelectedSexDraft(selectedSex);
        setIsSexPickerVisible(true);
    }, [selectedSex]);

    const onCloseSexPicker = useCallback(() => {
        setIsSexPickerVisible(false);
    }, []);

    const getPreparedFilters = useCallback((
        radiusKm?: number,
        date?: Date | null,
        sex?: Sex,
        minAge?: number,
        maxAge?: number,
    ) => {
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

        const hasAgeFilter = typeof minAge === 'number'
            && typeof maxAge === 'number'
            && (minAge !== MIN_AGE_LIMIT || maxAge !== MAX_AGE_LIMIT);

        if (hasAgeFilter) {
            nextFilters.minAge = minAge;
            nextFilters.maxAge = maxAge;
        }

        return nextFilters;
    }, []);

    const onSelectRadius = useCallback((value: number) => {
        const nextRadiusKm = selectedRadiusKm === value ? undefined : value;
        setSelectedRadiusKm(nextRadiusKm);
        const nextFilters = getPreparedFilters(nextRadiusKm, selectedDate, selectedSex, selectedMinAge, selectedMaxAge);
        onSyncFilters(nextFilters);
    }, [getPreparedFilters, onSyncFilters, selectedDate, selectedMaxAge, selectedMinAge, selectedRadiusKm, selectedSex]);

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
            const nextFilters = getPreparedFilters(selectedRadiusKm, null, selectedSex, selectedMinAge, selectedMaxAge);
            onSyncFilters(nextFilters);
            return;
        }

        setCurrentMonth(item.dateString);
        setSelectedDate(parsedDate);
        const nextFilters = getPreparedFilters(selectedRadiusKm, parsedDate, selectedSex, selectedMinAge, selectedMaxAge);
        onSyncFilters(nextFilters);
    }, [getPreparedFilters, onSyncFilters, selectedDate, selectedMaxAge, selectedMinAge, selectedRadiusKm, selectedSex]);

    const onSelectSex = useCallback((sex: Sex) => {
        setSelectedSexDraft(sex);
    }, []);

    const onConfirmSex = useCallback(() => {
        if (!selectedSexDraft) {
            setIsSexPickerVisible(false);
            return;
        }

        const nextSex = selectedSex === selectedSexDraft ? undefined : selectedSexDraft;
        setSelectedSex(nextSex);
        const nextFilters = getPreparedFilters(selectedRadiusKm, selectedDate, nextSex, selectedMinAge, selectedMaxAge);
        onSyncFilters(nextFilters);
        setIsSexPickerVisible(false);
    }, [getPreparedFilters, onSyncFilters, selectedDate, selectedMaxAge, selectedMinAge, selectedRadiusKm, selectedSex, selectedSexDraft]);

    const onAgeRangeChange = useCallback((minAge: number, maxAge: number) => {
        if (selectedMinAge === minAge && selectedMaxAge === maxAge) {
            return;
        }

        setSelectedMinAge(minAge);
        setSelectedMaxAge(maxAge);
        const nextFilters = getPreparedFilters(selectedRadiusKm, selectedDate, selectedSex, minAge, maxAge);
        onSyncFilters(nextFilters);
    }, [getPreparedFilters, onSyncFilters, selectedDate, selectedMaxAge, selectedMinAge, selectedRadiusKm, selectedSex]);

    const onMonthChange = useCallback((month: DateData) => {
        setCurrentMonth(month.dateString);
    }, []);

    const onReset = useCallback(() => {
        setSelectedRadiusKm(undefined);
        setSelectedDate(null);
        setSelectedSex(undefined);
        setSelectedSexDraft(undefined);
        setSelectedMinAge(MIN_AGE_LIMIT);
        setSelectedMaxAge(MAX_AGE_LIMIT);
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
        const isAgeDefault = selectedMinAge === MIN_AGE_LIMIT && selectedMaxAge === MAX_AGE_LIMIT;
        return !selectedDate && typeof selectedRadiusKm !== 'number' && !selectedSex && isAgeDefault;
    }, [selectedDate, selectedMaxAge, selectedMinAge, selectedRadiusKm, selectedSex]);

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
        selectedSex: selectedSexDraft,
        selectedMinAge,
        selectedMaxAge,
        minAgeLimit: MIN_AGE_LIMIT,
        maxAgeLimit: MAX_AGE_LIMIT,
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
        onConfirmSex,
        onAgeRangeChange,
        onReset,
    };
};
