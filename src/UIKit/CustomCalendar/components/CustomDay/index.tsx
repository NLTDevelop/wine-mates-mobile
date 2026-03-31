import { Typography } from '@/UIKit/Typography';
import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { IColors } from '@/UIProvider/theme/IColors';
import { DateData } from 'react-native-calendars';
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking';
import { useCustomDay } from '../../presenters/useCustomDay';
import { IUserStatus } from '@/modules-one-platform/base/entities/users/types/IUserStatus';
import dayjs from 'dayjs';

interface IProps {
    date: DateData;
    state: '' | 'selected' | 'disabled' | 'inactive' | 'today';
    marking?: MarkingProps;
    colors: IColors;
    status?: IUserStatus;
    onPress?: (date: DateData) => void;
    minDate?: string;
    maxDate?: string;
}

export const CustomDay = ({ date, state, marking, colors, onPress, status, minDate, maxDate }: IProps) => {
    const isToday = state === 'today';
    const isSelected = marking?.selected || false;
    const isOutsideMonth = state === 'disabled';
    const isRangeStart = marking?.startingDay || false;
    const isRangeEnd = marking?.endingDay || false;
    const isInactive = state === 'inactive';
    const isBeforeMinDate = !!minDate && dayjs(date.dateString).isBefore(minDate, 'day');
    const isAfterMaxDate = !!maxDate && dayjs(date.dateString).isAfter(maxDate, 'day');
    const isDisabled = state === 'disabled' || isInactive || isBeforeMinDate || isAfterMaxDate;
    const styleDetails = useMemo(() => ({
        isSelected,
        isOutsideMonth,
        isToday,
        isRangeStart,
        isRangeEnd,
        isDisabled,
    }), [isDisabled, isOutsideMonth, isRangeEnd, isRangeStart, isSelected, isToday]);
    const styles = useMemo(() => getStyles(colors, styleDetails), [colors, styleDetails]);

    const { onDayPress } = useCustomDay({ date, onPress, isDisabled });

    const fillColor = useMemo(() => {
        if (!isSelected) return undefined;
        if (!isRangeStart && !isRangeEnd) return colors.card;
        return colors.primary;
    }, [colors, isRangeEnd, isRangeStart, isSelected]);

    const leftFillerColor = isSelected && !isRangeStart ? fillColor : undefined;
    const rightFillerColor = isSelected && !isRangeEnd ? fillColor : undefined;

    return (
        <TouchableOpacity onPress={onDayPress} style={styles.wrapper} disabled={isDisabled}>
            {(leftFillerColor || rightFillerColor) && (
                <View style={styles.fillers} pointerEvents="none">
                    <View style={[styles.filler, leftFillerColor && { backgroundColor: leftFillerColor }]} />
                    <View style={[styles.filler, rightFillerColor && { backgroundColor: rightFillerColor }]} />
                </View>
            )}
            <View style={styles.container}>
                <Typography text={String(date.day)} variant="subtitle_16_500" style={styles.text} />
                <View style={[styles.status, { backgroundColor: status?.color }]} />
            </View>
        </TouchableOpacity>
    );
};
