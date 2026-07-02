import { useMemo } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Typography } from '@/UIKit/Typography';
import { CalendarModal } from '@/UIKit/CalendarModal';
import { RadiusButtons } from './components/RadiusButtons';
import { useEventFiltersView } from './presenters/useEventFiltersView';
import { getStyles } from './styles';
import { CalendarIcon } from '@assets/icons/CalendarIcon';
import { RangeSlider } from '@/UIKit/RangeSlider';
import { QuickFilterSection } from '@/modules/chooseWine/ui/ChooseWineFiltersView/components/QuickFilterSection';

interface IProps {}

export const EventFiltersView = ({}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        currentMonth,
        markedDates,
        selectedDateText,
        sexFilterItems,
        selectedMinAge,
        selectedMaxAge,
        selectedMinPrice,
        selectedMaxPrice,
        priceCurrencySuffix,
        minAgeLimit,
        maxAgeLimit,
        allowedAgeMin,
        allowedAgeMax,
        minPriceLimit,
        maxPriceLimit,
        allowedPriceMin,
        allowedPriceMax,
        calendarMinDate,
        calendarMaxDate,
        radiusOption1,
        radiusOption5,
        radiusOption10,
        radiusOption50,
        isCalendarVisible,
        isResetDisabled,
        isInitialLoading,
        isDateDisabled,
        isAgeDisabled,
        isPriceDisabled,
        onOpenCalendar,
        onCloseCalendar,
        onDayPress,
        onMonthChange,
        onAgeRangeChange,
        onPriceRangeChange,
        onReset,
    } = useEventFiltersView({ t });

    return (
        <>
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
                {isInitialLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator color={colors.primary} size="large" />
                    </View>
                ) : (
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
                            <TouchableOpacity
                                style={[styles.dateButton, isDateDisabled ? styles.disabledControl : undefined]}
                                onPress={onOpenCalendar}
                                disabled={isDateDisabled}
                            >
                                <Typography
                                    text={selectedDateText || t('eventFilters.selectDate')}
                                    variant="body_400"
                                    style={isDateDisabled ? styles.disabledText : styles.dateText}
                                />
                                <CalendarIcon color={colors.text_light} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Typography text={t('eventFilters.age')} variant="h5" style={styles.sectionTitle} />
                            <RangeSlider
                                min={minAgeLimit}
                                max={maxAgeLimit}
                                minValue={selectedMinAge}
                                maxValue={selectedMaxAge}
                                allowedMin={allowedAgeMin}
                                allowedMax={allowedAgeMax}
                                onChange={onAgeRangeChange}
                                isDisabled={isAgeDisabled}
                            />
                        </View>
                        <View>
                            <Typography text={t('event.price')} variant="h5" style={styles.sectionTitle} />
                            <RangeSlider
                                min={minPriceLimit}
                                max={maxPriceLimit}
                                minValue={selectedMinPrice}
                                maxValue={selectedMaxPrice}
                                allowedMin={allowedPriceMin}
                                allowedMax={allowedPriceMax}
                                onChange={onPriceRangeChange}
                                valueSuffix={priceCurrencySuffix}
                                isDisabled={isPriceDisabled}
                            />
                        </View>
                        <View>
                            <QuickFilterSection title={t('eventFilters.sex')} items={sexFilterItems} />
                        </View>
                    </View>
                )}
            </ScreenContainer>

            {!isInitialLoading && (
                <CalendarModal
                    visible={isCalendarVisible}
                    title={t('eventFilters.date')}
                    closeText={t('eventFilters.close')}
                    currentMonth={currentMonth}
                    markedDates={markedDates}
                    minDate={calendarMinDate}
                    maxDate={calendarMaxDate}
                    onClose={onCloseCalendar}
                    onDayPress={onDayPress}
                    onMonthChange={onMonthChange}
                />
            )}

        </>
    );
};
