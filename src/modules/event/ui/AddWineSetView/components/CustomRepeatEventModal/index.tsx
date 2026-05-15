import { Button } from '@/UIKit/Button';
import { useUiContext } from '@/UIProvider';
import { memo, useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import Modal from 'react-native-modal';
import { getStyles } from './styles';
import { RepeatRuleConfig } from '@/entities/events/types/RepeatRuleConfig';
import { useCustomRepeatEventModal } from './presenters/useCustomRepeatEventModal';
import { CalendarModal } from '@/UIKit/CalendarModal';
import { CustomRepeatEventHeader } from './components/CustomRepeatEventHeader';
import { CustomRepeatEventInterval } from './components/CustomRepeatEventInterval';
import { CustomRepeatEventDaysRepetition } from './components/CustomRepeatEventDaysRepetition';
import { CustomRepeatEventEndCondition } from './components/CustomRepeatEventEndCondition';

interface IProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (value: RepeatRuleConfig) => void;
}

const CustomRepeatEventModalComponent = ({ visible, onClose, onConfirm }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        repeatInterval,
        frequency,
        repetitionCount,
        currentMonth,
        minDate,
        formattedEndDate,
        isCalendarVisible,
        intervalItems,
        frequencyItems,
        repetitionCountItems,
        weekDayItems,
        markedDates,
        isNeedShowWeekDays,
        isNeverEndConditionSelected,
        isDateEndConditionSelected,
        isCountEndConditionSelected,
        isDateControlDisabled,
        isCountControlDisabled,
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
    } = useCustomRepeatEventModal({ onConfirm });

    return (
        <>
            <Modal
                isVisible={visible}
                onBackdropPress={onClose}
                onBackButtonPress={onClose}
                backdropTransitionOutTiming={400}
                animationInTiming={400}
                animationOutTiming={400}
                backdropOpacity={0.35}
                style={styles.modal}
                deviceHeight={Dimensions.get('screen').height}
                deviceWidth={Dimensions.get('screen').width}
                useNativeDriver
                useNativeDriverForBackdrop
                hideModalContentWhileAnimating
                statusBarTranslucent
            >
                <View style={styles.modalContent}>
                    <CustomRepeatEventHeader onClose={onClose} />

                    <CustomRepeatEventInterval
                        intervalItems={intervalItems}
                        repeatInterval={repeatInterval}
                        onSelectInterval={onSelectInterval}
                        onSelectFrequency={onSelectFrequency}
                        frequencyItems={frequencyItems}
                        frequency={frequency}
                    />
                    {isNeedShowWeekDays && <CustomRepeatEventDaysRepetition weekDayItems={weekDayItems} />}
                    <CustomRepeatEventEndCondition
                        onSelectNeverEndCondition={onSelectNeverEndCondition}
                        isNeverEndConditionSelected={isNeverEndConditionSelected}
                        onSelectDateEndCondition={onSelectDateEndCondition}
                        isDateEndConditionSelected={isDateEndConditionSelected}
                        isDateControlDisabled={isDateControlDisabled}
                        onOpenCalendar={onOpenCalendar}
                        formattedEndDate={formattedEndDate}
                        onSelectCountEndCondition={onSelectCountEndCondition}
                        isCountEndConditionSelected={isCountEndConditionSelected}
                        isCountControlDisabled={isCountControlDisabled}
                        repetitionCountItems={repetitionCountItems}
                        repetitionCount={repetitionCount}
                        onSelectRepetitionCount={onSelectRepetitionCount}
                    />
                    <Button
                        text={t('common.save')}
                        onPress={onSavePress}
                        type="main"
                        containerStyle={styles.saveButton}
                    />
                </View>
            </Modal>
            {isCalendarVisible && (
                <CalendarModal
                    visible={isCalendarVisible}
                    title={t('repeatEvent.endDate')}
                    closeText={t('eventFilters.close')}
                    currentMonth={currentMonth}
                    markedDates={markedDates}
                    minDate={minDate}
                    onClose={onCloseCalendar}
                    onDayPress={onDayPress}
                    onMonthChange={onMonthChange}
                />
            )}
        </>
    );
};

export const CustomRepeatEventModal = memo(CustomRepeatEventModalComponent);
