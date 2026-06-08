import { useCallback, useMemo, useState } from 'react';
import { DateData } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { format } from 'date-fns';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { RepeatRuleConfig, RepeatRuleEndCondition } from '@/entities/events/types/RepeatRuleConfig';
import { RepeatRuleFrequency } from '@/entities/events/enums/RepeatRuleFrequency';
import { RepeatRuleEndConditionType } from '@/entities/events/enums/RepeatRuleEndConditionType';
import { ICustomRepeatWeekDayItem } from '@/modules/event/types/ICustomRepeatWeekDayItem';
import { FREQUENCY_ITEMS, INTERVAL_ITEMS, REPETITION_COUNT_ITEMS, WEEK_DAY_ITEMS } from '../consts/const';

interface IProps {
    onConfirm: (value: RepeatRuleConfig) => void;
}

const getTodayDateString = () => {
    return new Date().toISOString().slice(0, 10);
};

const getRepeatRuleFrequency = (value: unknown): RepeatRuleFrequency | null => {
    if (value === RepeatRuleFrequency.Day) {
        return RepeatRuleFrequency.Day;
    }

    if (value === RepeatRuleFrequency.Week) {
        return RepeatRuleFrequency.Week;
    }

    if (value === RepeatRuleFrequency.Month) {
        return RepeatRuleFrequency.Month;
    }

    if (value === RepeatRuleFrequency.Year) {
        return RepeatRuleFrequency.Year;
    }

    return null;
};

export const useCustomRepeatEventModal = ({ onConfirm }: IProps) => {
    const [repeatInterval, setRepeatInterval] = useState(1);
    const [frequency, setFrequency] = useState<RepeatRuleFrequency>(RepeatRuleFrequency.Day);
    const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([1]);
    const [endConditionType, setEndConditionType] = useState<RepeatRuleEndConditionType>(
        RepeatRuleEndConditionType.Never,
    );
    const [endDate, setEndDate] = useState(getTodayDateString);
    const [currentMonth, setCurrentMonth] = useState(getTodayDateString);
    const [minDate] = useState(getTodayDateString);
    const [repetitionCount, setRepetitionCount] = useState(5);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    const onSelectInterval = useCallback((item: IDropdownItem) => {
        if (typeof item.value === 'number') {
            setRepeatInterval(item.value);
        }
    }, []);

    const onSelectFrequency = useCallback((item: IDropdownItem) => {
        const nextFrequency = getRepeatRuleFrequency(item.value);

        if (nextFrequency) {
            setFrequency(nextFrequency);
        }
    }, []);

    const onSelectRepetitionCount = useCallback((item: IDropdownItem) => {
        if (typeof item.value === 'number') {
            setRepetitionCount(item.value);
        }
    }, []);

    const onSelectNeverEndCondition = useCallback(() => {
        setEndConditionType(RepeatRuleEndConditionType.Never);
    }, []);

    const onSelectDateEndCondition = useCallback(() => {
        setEndConditionType(RepeatRuleEndConditionType.Date);
    }, []);

    const onSelectCountEndCondition = useCallback(() => {
        setEndConditionType(RepeatRuleEndConditionType.Count);
    }, []);

    const onDayPress = useCallback((item: DateData) => {
        setEndDate(item.dateString);
        setCurrentMonth(item.dateString);
        setIsCalendarVisible(false);
    }, []);

    const onMonthChange = useCallback((item: DateData) => {
        setCurrentMonth(item.dateString);
    }, []);

    const createOnWeekDayPress = useCallback((dayValue: number) => {
        return () => {
            setSelectedWeekDays(prev => {
                if (prev.includes(dayValue)) {
                    const nextValue = prev.filter(item => item !== dayValue);

                    if (nextValue.length === 0) {
                        return prev;
                    }

                    return nextValue;
                }

                return [...prev, dayValue].sort((left, right) => left - right);
            });
        };
    }, []);

    const weekDayItems = useMemo<ICustomRepeatWeekDayItem[]>(() => {
        return WEEK_DAY_ITEMS.map(item => ({
            value: item.value,
            label: item.label,
            isSelected: selectedWeekDays.includes(item.value),
            onPress: createOnWeekDayPress(item.value),
        }));
    }, [createOnWeekDayPress, selectedWeekDays]);

    const markedDates = useMemo<MarkedDates>(() => {
        return {
            [endDate]: {
                selected: true,
            },
        };
    }, [endDate]);

    const isNeedShowWeekDays = frequency === RepeatRuleFrequency.Week;

    const formattedEndDate = useMemo(() => {
        try {
            const [yearString, monthString, dayString] = endDate.split('-');
            const date = new Date(Number(yearString), Number(monthString) - 1, Number(dayString));

            return format(date, 'dd/MM/yyyy');
        } catch {
            return endDate;
        }
    }, [endDate]);

    const onOpenCalendar = useCallback(() => {
        setEndConditionType(RepeatRuleEndConditionType.Date);
        setIsCalendarVisible(true);
    }, []);

    const onCloseCalendar = useCallback(() => {
        setIsCalendarVisible(false);
    }, []);

    const repeatRule = useMemo<RepeatRuleConfig>(() => {
        const endCondition: RepeatRuleEndCondition = (() => {
            if (endConditionType === RepeatRuleEndConditionType.Count) {
                return {
                    type: RepeatRuleEndConditionType.Count,
                    value: repetitionCount,
                };
            }

            if (endConditionType === RepeatRuleEndConditionType.Date) {
                return {
                    type: RepeatRuleEndConditionType.Date,
                    value: endDate,
                };
            }

            return {
                type: RepeatRuleEndConditionType.Never,
            };
        })();

        const result: RepeatRuleConfig = {
            frequency,
            interval: repeatInterval,
            endCondition,
        };

        if (frequency === RepeatRuleFrequency.Week) {
            result.weekDays = selectedWeekDays;
        }

        return result;
    }, [endConditionType, endDate, frequency, repeatInterval, repetitionCount, selectedWeekDays]);

    const onSavePress = useCallback(() => {
        onConfirm(repeatRule);
    }, [onConfirm, repeatRule]);

    return {
        repeatInterval,
        frequency,
        repetitionCount,
        currentMonth,
        minDate,
        formattedEndDate,
        isCalendarVisible,
        intervalItems: INTERVAL_ITEMS,
        frequencyItems: FREQUENCY_ITEMS,
        repetitionCountItems: REPETITION_COUNT_ITEMS,
        weekDayItems,
        markedDates,
        isNeedShowWeekDays,
        isNeverEndConditionSelected: endConditionType === RepeatRuleEndConditionType.Never,
        isDateEndConditionSelected: endConditionType === RepeatRuleEndConditionType.Date,
        isCountEndConditionSelected: endConditionType === RepeatRuleEndConditionType.Count,
        isDateControlDisabled: endConditionType !== RepeatRuleEndConditionType.Date,
        isCountControlDisabled: endConditionType !== RepeatRuleEndConditionType.Count,
        onOpenCalendar,
        onCloseCalendar,
        onSelectInterval,
        onSelectFrequency,
        onSelectRepetitionCount,
        onSelectNeverEndCondition,
        onSelectDateEndCondition,
        onSelectCountEndCondition,
        onDayPress,
        onMonthChange,
        onSavePress,
    };
};
