import { useCallback, useMemo } from 'react';
import { Calendar, DateData } from 'react-native-calendars';
import { useUiContext } from '../../UIProvider';
import { getStyles } from './styles';
import { scaleFontSize } from '@/utils';
import { CustomDay } from './components/CustomDay';
import { ActivityIndicator, View, ViewStyle } from 'react-native';
import { MarkedDates } from 'react-native-calendars/src/types';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';

type TStatusByDate = Record<string, unknown>;

interface IProps {
    currentMonth: string;
    markedDates: MarkedDates;
    onDayPress: (item: DateData) => void;
    handleMonthChange?: (month: DateData) => void;
    statusByDate?: TStatusByDate;
    isLoading?: boolean;
    calendarStyle?: ViewStyle;
    minDate?: string;
    maxDate?: string;
    enableSwipeMonths?: boolean;
}

export const CustomCalendar = ({ currentMonth, markedDates, onDayPress, handleMonthChange, statusByDate,
    isLoading = false, calendarStyle, minDate, maxDate, enableSwipeMonths = true
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const renderDay = useCallback((props: any) => (
        <CustomDay
            {...props}
            colors={colors}
            onPress={(item: DateData) => onDayPress(item)}
            status={statusByDate?.[props.date?.dateString]}
            minDate={minDate}
            maxDate={maxDate}
        />
    ), [colors, maxDate, minDate, onDayPress, statusByDate]);

    const renderArrow = useCallback((direction: string) => (
        <ArrowDownIcon
            color={colors.text}
            width={24}
            height={24}
        />
    ), [colors]);

    return (
        <View style={styles.wrapper}>
            <Calendar
                initialDate={currentMonth}
                firstDay={1}
                enableSwipeMonths={enableSwipeMonths}
                markingType="period"
                markedDates={markedDates}
                onDayPress={onDayPress}
                minDate={minDate}
                maxDate={maxDate}
                monthFormat="MMMM yyyy"
                onMonthChange={handleMonthChange}
                style={[styles.calendar, calendarStyle]}
                theme={{
                    backgroundColor: colors.background,
                    calendarBackground: colors.background,

                    // Header
                    monthTextColor: colors.text,
                    textMonthFontFamily: 'Manrope-Medium',
                    textMonthFontSize: scaleFontSize(14),

                    // Week Days
                    textSectionTitleColor: colors.text_light,
                    textDayHeaderFontFamily: 'Manrope-Medium',
                    textDayHeaderFontSize: scaleFontSize(12),

                    // Days
                    // dayTextColor: colors.text_strong,
                    // textDayFontFamily: 'Manrope-Medium',
                    // textDayFontSize: scaleFontSize(16),

                    // Today & selected
                    // todayTextColor: colors.primary,
                    // selectedDayBackgroundColor: colors.primary,
                    // selectedDayTextColor: colors.text_inverted,

                    // Arrows
                    arrowColor: colors.icon,
                    
                }}
                renderArrow={renderArrow}
                dayComponent={renderDay}
            />
            {isLoading && (
                <View style={styles.loader} pointerEvents="none">
                    <ActivityIndicator color={colors.primary_secondary} size="large" />
                </View>
            )}
        </View>
    );
};
