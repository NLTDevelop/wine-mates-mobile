import { useCallback, useMemo } from 'react';
import { Calendar, DateData } from 'react-native-calendars';
import { useUiContext } from '../../UIProvider';
import { getStyles } from './styles';
import { scaleFontSize } from '@/utils';
import { CustomDay } from './components/CustomDay';
import { ActivityIndicator, View, ViewStyle } from 'react-native';
import { MarkedDates } from 'react-native-calendars/src/types';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon';
import { useCalendarLocale } from '@/hooks/useCalendarLocale';

interface IProps {
    currentMonth: string;
    markedDates: MarkedDates;
    onDayPress: (item: DateData) => void;
    handleMonthChange?: (month: DateData) => void;
    isLoading?: boolean;
    calendarStyle?: ViewStyle;
    minDate?: string;
    maxDate?: string;
    enableSwipeMonths?: boolean;
}

export const CustomCalendar = ({ currentMonth, markedDates, onDayPress, handleMonthChange,
    isLoading = false, calendarStyle, minDate, maxDate, enableSwipeMonths = true
}: IProps) => {
    const calendarLocale = useCalendarLocale();
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const renderDay = useCallback((props: any) => (
        <CustomDay
            {...props}
            colors={colors}
            onPress={onDayPress}
            minDate={minDate}
            maxDate={maxDate}
        />
    ), [colors, maxDate, minDate, onDayPress ]);

    const renderArrow = useCallback((direction: string) => (
        <NextArrowIcon rotate={direction === 'left' ? 180 : 0} color={colors.icon} strokeWidth={1.9} />
    ), [colors.icon]);

    return (
        <View style={styles.wrapper}>
            <Calendar
                key={calendarLocale}
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
                    textMonthFontFamily: 'VisueltPro-Regular',
                    textMonthFontSize: scaleFontSize(14),

                    // Week Days
                    textSectionTitleColor: colors.text_light,
                    textDayHeaderFontFamily: 'VisueltPro-Medium',
                    textDayHeaderFontSize: scaleFontSize(12),

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
