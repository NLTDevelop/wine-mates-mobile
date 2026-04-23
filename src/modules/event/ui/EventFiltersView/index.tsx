import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Typography } from '@/UIKit/Typography';
import { CalendarModal } from './components/CalendarModal';
import { RadiusButtons } from './components/RadiusButtons';
import { useEventFiltersView } from './presenters/useEventFiltersView';
import { getStyles } from './styles';

interface IProps {}

export const EventFiltersView = ({}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
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
    } = useEventFiltersView();

    return (
        <ScreenContainer
            edges={['top']}
            scrollEnabled
            withGradient
            headerComponent={
                <HeaderWithBackButton
                    title={t('common.filters')}
                    rightComponent={
                        <TouchableOpacity onPress={onReset} disabled={isResetDisabled} style={styles.resetButton}>
                            <Typography
                                text={t('common.reset')}
                                variant="body_500"
                                style={isResetDisabled ? styles.resetTextDisabled : styles.resetText}
                            />
                        </TouchableOpacity>
                    }
                />
            }
        >
            <View style={styles.container}>
                <View>
                    <Typography text={t('eventFilters.radius')} variant="h5" style={styles.sectionTitle} />
                    <RadiusButtons
                        radiusOption1={radiusOption1}
                        radiusOption5={radiusOption5}
                        radiusOption10={radiusOption10}
                        radiusOption50={radiusOption50}
                    />
                </View>
                <View>
                    <Typography text={t('eventFilters.date')} variant="h5" style={styles.sectionTitle} />
                    <TouchableOpacity style={styles.dateButton} onPress={onOpenCalendar}>
                        <Typography
                            text={selectedDateText || t('eventFilters.selectDate')}
                            variant="body_400"
                            style={styles.dateText}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <CalendarModal
                visible={isCalendarVisible}
                title={t('eventFilters.date')}
                closeText={t('eventFilters.close')}
                currentMonth={currentMonth}
                markedDates={markedDates}
                onClose={onCloseCalendar}
                onDayPress={onDayPress}
                onMonthChange={onMonthChange}
            />
        </ScreenContainer>
    );
};
