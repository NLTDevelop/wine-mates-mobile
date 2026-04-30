import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Typography } from '@/UIKit/Typography';
import { CalendarModal } from '@/UIKit/CalendarModal';
import { RadiusButtons } from './components/RadiusButtons';
import { useEventFiltersView } from './presenters/useEventFiltersView';
import { getStyles } from './styles';
import { SexPickerModal } from './components/SexPickerModal';
import { CalendarIcon } from '@assets/icons/CalendarIcon';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { RangeSlider } from '@/UIKit/RangeSlider';
import { LanguageSelector } from '@/libs/languagePicker/components/LanguageSelector';

interface IProps {}

export const EventFiltersView = ({}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        currentMonth,
        markedDates,
        selectedDateText,
        selectedSexText,
        selectedLanguage,
        selectedSex,
        selectedMinAge,
        selectedMaxAge,
        selectedMinPrice,
        selectedMaxPrice,
        minAgeLimit,
        maxAgeLimit,
        minPriceLimit,
        maxPriceLimit,
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
        onChangeLanguage,
        onAgeRangeChange,
        onPriceRangeChange,
        onReset,
    } = useEventFiltersView({ t });

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
                        <CalendarIcon color={colors.text_light} />
                    </TouchableOpacity>
                </View>
                <View>
                    <Typography text={t('event.eventLanguage')} variant="h5" style={styles.sectionTitle} />
                    <LanguageSelector value={selectedLanguage} onChange={onChangeLanguage} />
                </View>

                <View>
                    <Typography text={t('eventFilters.age')} variant="h5" style={styles.sectionTitle} />
                    <RangeSlider
                        min={minAgeLimit}
                        max={maxAgeLimit}
                        minValue={selectedMinAge}
                        maxValue={selectedMaxAge}
                        onChange={onAgeRangeChange}
                    />
                </View>
                <View>
                    <Typography text={t('event.price')} variant="h5" style={styles.sectionTitle} />
                    <RangeSlider
                        min={minPriceLimit}
                        max={maxPriceLimit}
                        minValue={selectedMinPrice}
                        maxValue={selectedMaxPrice}
                        onChange={onPriceRangeChange}
                        valueSuffix="$"
                    />
                </View>
                <View>
                    <Typography text={t('eventFilters.sex')} variant="h5" style={styles.sectionTitle} />
                    <TouchableOpacity style={styles.sexButton} onPress={onOpenSexPicker}>
                        <Typography
                            text={selectedSexText || t('eventFilters.selectSex')}
                            variant="body_400"
                            style={styles.sexText}
                        />
                        <ArrowDownIcon color={colors.text_light} width={20} height={20} />
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

            <SexPickerModal
                visible={isSexPickerVisible}
                selectedSex={selectedSex}
                onClose={onCloseSexPicker}
                onSelectSex={onSelectSex}
                onConfirm={onConfirmSex}
            />
        </ScreenContainer>
    );
};
