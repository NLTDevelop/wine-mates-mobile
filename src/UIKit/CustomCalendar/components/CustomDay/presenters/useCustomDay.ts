import { useCallback, useMemo } from 'react';
import { IProps, ICustomDayStyleDetails } from '../types';
import dayjs from 'dayjs';
import { ViewStyle } from 'react-native';

interface IResult {
    styleDetails: ICustomDayStyleDetails;
    onDayPress: () => void;
    shouldRenderFillers: boolean;
    leftFillerStyle: ViewStyle | undefined;
    rightFillerStyle: ViewStyle | undefined;
    dayNumber: string;
}

export const useCustomDay = ({ date, state, marking, colors, onPress, minDate, maxDate }: IProps): IResult => {
    const isToday = state === 'today';
    const isSelected = marking?.selected || false;
    const isOutsideMonth = state === 'disabled';
    const isRangeStart = marking?.startingDay || false;
    const isRangeEnd = marking?.endingDay || false;
    const isInactive = state === 'inactive';
    const isBeforeMinDate = !!minDate && dayjs(date.dateString).isBefore(minDate, 'day');
    const isAfterMaxDate = !!maxDate && dayjs(date.dateString).isAfter(maxDate, 'day');
    const isDisabled = state === 'disabled' || isInactive || isBeforeMinDate || isAfterMaxDate;

    const styleDetails = useMemo<ICustomDayStyleDetails>(() => ({
        isSelected,
        isOutsideMonth,
        isToday,
        isRangeStart,
        isRangeEnd,
        isDisabled,
    }), [isDisabled, isOutsideMonth, isRangeEnd, isRangeStart, isSelected, isToday]);

    const onDayPress = useCallback(() => {
        if (!isDisabled) {
            onPress?.(date);
        }
    }, [date, isDisabled, onPress]);

    const fillColor = useMemo(() => {
        if (!isSelected) return undefined;
        if (!isRangeStart && !isRangeEnd) return colors.primary_secondary;
        return colors.primary;
    }, [colors.primary, colors.primary_secondary, isRangeEnd, isRangeStart, isSelected]);

    const leftFillerStyle = useMemo<ViewStyle | undefined>(() => {
        if (!isSelected || isRangeStart || !fillColor) return undefined;
        return { backgroundColor: fillColor };
    }, [fillColor, isRangeStart, isSelected]);

    const rightFillerStyle = useMemo<ViewStyle | undefined>(() => {
        if (!isSelected || isRangeEnd || !fillColor) return undefined;
        return { backgroundColor: fillColor };
    }, [fillColor, isRangeEnd, isSelected]);

    const shouldRenderFillers = useMemo(() => Boolean(leftFillerStyle || rightFillerStyle), [leftFillerStyle, rightFillerStyle]);
    const dayNumber = useMemo(() => String(date.day), [date.day]);

    return {
        styleDetails,
        onDayPress,
        shouldRenderFillers,
        leftFillerStyle,
        rightFillerStyle,
        dayNumber,
    };
};
