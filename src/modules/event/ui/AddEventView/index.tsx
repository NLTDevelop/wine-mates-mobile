import { useMemo } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { CustomInput } from '@/UIKit/CustomInput';
import { Button } from '@/UIKit/Button';
import { Typography } from '@/UIKit/Typography';
import { useAddEvent } from './presenters/useAddEvent';
import { MapLocationIcon } from '@assets/icons/MapLocationIcon';
import { PhoneInputField } from '@/libs/countryCodePicker/components/PhoneInputField';
import { CalendarIcon } from '@assets/icons/CalendarIcon';
import { DateTimePickerModal } from '@/UIKit/DateTimePickerModal';
import { useDateTimePicker } from './presenters/useDateTimePicker';
import { useEventTypeModal } from './presenters/useEventTypeModal';
import { useSexModal } from './presenters/useSexModal';
import { useParticipationConditionModal } from './presenters/useParticipationConditionModal';
import { useConfirmationRequiredModal } from './presenters/useConfirmationRequiredModal';
import { useCurrencyPickerModal } from './presenters/useCurrencyPickerModal';
import { usePaymentMethodsModal } from './presenters/usePaymentMethodsModal';
import { useEventDateTimeFormatter } from '../../presenters/useEventDateTimeFormatter';
import { useEventTypeLabel } from '../../presenters/useEventTypeLabel';
import { PaymentMethodsPickerModal } from './components/PaymentMethodsPickerModal';
import { CurrencyModal } from './components/CurrencyModal';
import { SingleSelectModal } from './components/SingleSelectModal';
import { PickerButton } from './components/PickerButton';
import { CalendarModal } from '@/UIKit/CalendarModal';
import { LanguageSelector } from '@/libs/languagePicker/components/LanguageSelector';
import { isIOS, scaleVertical } from '@/utils';
import { ClockIcon } from '@assets/icons/ClockIcon';
import { RangeSlider } from '@/UIKit/RangeSlider';

export const AddEventView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        form,
        isLoading,
        isPaymentMethodsLoading,
        isPartyEventType,
        paymentMethods,
        currencies,
        disabled,
        onChangeTheme,
        onChangeDescription,
        onChangeRestaurantName,
        onChangeSpeakerName,
        onStartDateSelect,
        onEndDateSelect,
        onStartTimeSelect,
        onEndTimeSelect,
        onChangePhoneNumber,
        onChangePrice,
        onChangeLanguage,
        onChangeSeats,
        onAgeRangeChange,
        onChangeEventType,
        onChangeSex,
        onChangeParticipationCondition,
        onChangeCurrency,
        onChangeRequiresConfirmation,
        onChangePaymentMethodIds,
        onLocationPress,
        onSubmit,
    } = useAddEvent();

    const {
        isCalendarVisible,
        isTimePickerVisible,
        isStartTimePickerDisabled,
        isEndTimePickerDisabled,
        currentMonth,
        markedDates,
        calendarMinDate,
        calendarMaxDate,
        calendarTitle,
        timePickerTitle,
        mode,
        pickerDate,
        minimumDate,
        openStartDatePicker,
        openEndDatePicker,
        openStartTimePicker,
        openEndTimePicker,
        onCloseCalendar,
        onCloseTimePicker,
        onConfirm,
        onDateChange,
        onDayPress,
        onMonthChange,
    } = useDateTimePicker({
        onStartDateSelect,
        onEndDateSelect,
        onStartTimeSelect,
        onEndTimeSelect,
        selectedEventStartDate: form.eventStartDate,
        selectedEventEndDate: form.eventEndDate,
        selectedEventStartTime: form.eventStartTime,
        selectedEventEndTime: form.eventEndTime,
        t,
    });

    const { formattedValue: formattedStartDate } = useEventDateTimeFormatter({
        value: form.eventStartDate,
        mode: 'date',
    });
    const { formattedValue: formattedEndDate } = useEventDateTimeFormatter({ value: form.eventEndDate, mode: 'date' });
    const { formattedValue: formattedStartTime } = useEventDateTimeFormatter({
        value: form.eventStartTime,
        mode: 'time',
    });
    const { formattedValue: formattedEndTime } = useEventDateTimeFormatter({ value: form.eventEndTime, mode: 'time' });
    const eventTypeLabel = useEventTypeLabel({ eventType: form.eventType, t });

    const {
        isVisible: isEventTypeModalVisible,
        title: eventTypeModalTitle,
        items: eventTypeItems,
        onOpen: onOpenEventTypeModal,
        onClose: onCloseEventTypeModal,
        onConfirm: onConfirmEventType,
    } = useEventTypeModal({
        value: form.eventType,
        onChange: onChangeEventType,
    });

    const {
        isVisible: isSexModalVisible,
        title: sexModalTitle,
        selectedText: selectedSexText,
        items: sexItems,
        onOpen: onOpenSexModal,
        onClose: onCloseSexModal,
        onConfirm: onConfirmSex,
    } = useSexModal({
        value: form.sex,
        onChange: onChangeSex,
    });

    const {
        isVisible: isParticipationConditionModalVisible,
        title: participationConditionModalTitle,
        items: participationConditionItems,
        selectedText: selectedParticipationConditionText,
        onOpen: onOpenParticipationConditionModal,
        onClose: onCloseParticipationConditionModal,
        onConfirm: onConfirmParticipationCondition,
    } = useParticipationConditionModal({
        value: form.participationCondition,
        onChange: onChangeParticipationCondition,
    });

    const {
        isVisible: isConfirmationRequiredModalVisible,
        title: confirmationRequiredModalTitle,
        items: confirmationRequiredItems,
        selectedText: selectedConfirmationRequiredText,
        onOpen: onOpenConfirmationRequiredModal,
        onClose: onCloseConfirmationRequiredModal,
        onConfirm: onConfirmConfirmationRequired,
    } = useConfirmationRequiredModal({
        value: form.requiresConfirmation,
        onChange: onChangeRequiresConfirmation,
    });

    const {
        isVisible: isCurrencyModalVisible,
        draft: currencyDraft,
        items: currencyItems,
        selectedText: selectedCurrencyText,
        onOpen: onOpenCurrencyModal,
        onClose: onCloseCurrencyModal,
        onConfirm: onConfirmCurrency,
    } = useCurrencyPickerModal({
        value: form.currency,
        currencies,
        onChange: onChangeCurrency,
    });

    const {
        isVisible: isPaymentMethodsModalVisible,
        options: paymentMethodOptions,
        selectedText: selectedPaymentMethodsText,
        onOpen: onOpenPaymentMethodsModal,
        onClose: onClosePaymentMethodsModal,
        onConfirm: onConfirmPaymentMethods,
    } = usePaymentMethodsModal({
        value: form.paymentMethodIds,
        paymentMethods,
        onChange: onChangePaymentMethodIds,
    });

    return (
        <>
            <ScreenContainer
                edges={['top', 'bottom']}
                headerComponent={<HeaderWithBackButton title={t('event.addEvent')} isCentered={false} />}
                withGradient
            >
                <View style={styles.container}>
                    <KeyboardAwareScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.contentContainerStyle}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        bottomOffset={scaleVertical(82)}
                    >
                        <View style={styles.content}>
                            <Typography variant="h4" text={t('event.basicInfo')} />

                            <PickerButton
                                onPress={onOpenEventTypeModal}
                                text={eventTypeLabel || t('event.eventType')}
                                style={styles.pickerButton}
                            />
                            <PickerButton
                                onPress={onOpenConfirmationRequiredModal}
                                text={selectedConfirmationRequiredText}
                                style={styles.pickerButton}
                            />
                            <CustomInput
                                value={form.theme}
                                containerStyle={styles.inputContainerStyle}
                                onChangeText={onChangeTheme}
                                placeholder={t('event.tastingTheme')}
                                maxLength={300}
                            />
                            <CustomInput
                                value={form.speakerName}
                                containerStyle={styles.inputContainerStyle}
                                onChangeText={onChangeSpeakerName}
                                placeholder={t('event.speakerName')}
                            />
                            <PhoneInputField
                                value={form.phoneNumber}
                                onChangeText={onChangePhoneNumber}
                                placeholder={t('event.phoneNumber')}
                            />

                            {isPartyEventType && (
                                <>
                                    <Typography variant="h6" text={t('eventFilters.age')} />
                                    <RangeSlider
                                        min={18}
                                        max={80}
                                        minValue={form.minAge}
                                        maxValue={form.maxAge}
                                        onChange={onAgeRangeChange}
                                    />
                                    <PickerButton
                                        onPress={onOpenSexModal}
                                        text={selectedSexText}
                                        style={styles.pickerButton}
                                    />
                                    <PickerButton
                                        onPress={onOpenParticipationConditionModal}
                                        text={selectedParticipationConditionText}
                                        style={styles.pickerButton}
                                    />
                                </>
                            )}

                            <LanguageSelector value={form.language} onChange={onChangeLanguage} />

                            <CustomInput
                                value={form.description}
                                containerStyle={styles.inputContainerStyle}
                                inputContainerStyle={styles.descriptionInputContainerStyle}
                                onChangeText={onChangeDescription}
                                placeholder={t('event.shortDescription')}
                                multiline
                                maxLength={300}
                            />

                            <Typography variant="h4" text={t('event.locationAndSchedule')} />
                            <CustomInput
                                value={form.restaurantName}
                                containerStyle={styles.inputContainerStyle}
                                onChangeText={onChangeRestaurantName}
                                placeholder={t('event.restaurant')}
                            />

                            <TouchableOpacity onPress={onLocationPress} style={styles.locationButton}>
                                <Typography
                                    text={form.locationLabel || t('event.selectLocation')}
                                    variant="h6"
                                    style={styles.locationText}
                                />
                                <MapLocationIcon color={colors.text} />
                            </TouchableOpacity>

                            <View style={styles.row}>
                                <TouchableOpacity
                                    onPress={openStartDatePicker}
                                    onPressIn={Keyboard.dismiss}
                                    style={styles.inlinePickerButton}
                                >
                                    <Typography variant="h6" text={formattedStartDate || t('event.eventStartDate')} />
                                    <CalendarIcon color={colors.text_light} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={openEndDatePicker}
                                    onPressIn={Keyboard.dismiss}
                                    style={styles.inlinePickerButton}
                                >
                                    <Typography variant="h6" text={formattedEndDate || t('event.eventEndDate')} />
                                    <CalendarIcon color={colors.text_light} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    onPress={openStartTimePicker}
                                    onPressIn={Keyboard.dismiss}
                                    disabled={isStartTimePickerDisabled}
                                    style={[
                                        styles.inlinePickerButton,
                                        isStartTimePickerDisabled ? styles.disabledPickerButton : undefined,
                                    ]}
                                >
                                    <Typography variant="h6" text={formattedStartTime || t('event.eventStartTime')} />
                                    <ClockIcon />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={openEndTimePicker}
                                    onPressIn={Keyboard.dismiss}
                                    disabled={isEndTimePickerDisabled}
                                    style={[
                                        styles.inlinePickerButton,
                                        isEndTimePickerDisabled ? styles.disabledPickerButton : undefined,
                                    ]}
                                >
                                    <Typography variant="h6" text={formattedEndTime || t('event.eventEndTime')} />
                                    <ClockIcon />
                                </TouchableOpacity>
                            </View>

                            <Typography variant="h4" text={t('event.bookingAndDetails')} />
                            <PickerButton
                                onPress={onOpenPaymentMethodsModal}
                                text={selectedPaymentMethodsText || t('payments.paymentsMethods')}
                                style={styles.pickerButton}
                            />

                            <PickerButton
                                onPress={onOpenCurrencyModal}
                                text={selectedCurrencyText || t('event.currency')}
                                style={styles.pickerButton}
                            />

                            <CustomInput
                                value={form.price}
                                containerStyle={styles.inputContainerStyle}
                                onChangeText={onChangePrice}
                                placeholder={t('event.price')}
                                keyboardType="numeric"
                            />

                            <CustomInput
                                value={form.seats}
                                containerStyle={styles.inputContainerStyle}
                                onChangeText={onChangeSeats}
                                placeholder={t('event.numberOfSeats')}
                                keyboardType="numeric"
                            />
                        </View>
                    </KeyboardAwareScrollView>

                    <KeyboardStickyView
                        offset={{
                            closed: 0,
                            opened: isIOS ? scaleVertical(32) : 0,
                        }}
                    >
                        <View style={styles.buttonContainer}>
                            <Button
                                text={t('common.continue')}
                                onPress={onSubmit}
                                type="main"
                                disabled={disabled}
                                inProgress={isLoading}
                            />
                        </View>
                    </KeyboardStickyView>
                </View>
            </ScreenContainer>

            {isTimePickerVisible && (
                <DateTimePickerModal
                    visible={isTimePickerVisible}
                    mode={mode}
                    date={pickerDate}
                    minimumDate={minimumDate}
                    title={timePickerTitle}
                    onClose={onCloseTimePicker}
                    onConfirm={onConfirm}
                    onDateChange={onDateChange}
                />
            )}
            {isCalendarVisible && (
                <CalendarModal
                    visible={isCalendarVisible}
                    title={calendarTitle}
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
            {isEventTypeModalVisible && (
                <SingleSelectModal
                    visible={isEventTypeModalVisible}
                    title={eventTypeModalTitle}
                    onClose={onCloseEventTypeModal}
                    items={eventTypeItems}
                    onConfirm={onConfirmEventType}
                />
            )}
            {isSexModalVisible && (
                <SingleSelectModal
                    visible={isSexModalVisible}
                    title={sexModalTitle}
                    onClose={onCloseSexModal}
                    items={sexItems}
                    onConfirm={onConfirmSex}
                />
            )}
            {isParticipationConditionModalVisible && (
                <SingleSelectModal
                    visible={isParticipationConditionModalVisible}
                    title={participationConditionModalTitle}
                    onClose={onCloseParticipationConditionModal}
                    items={participationConditionItems}
                    onConfirm={onConfirmParticipationCondition}
                />
            )}
            {isPaymentMethodsModalVisible && (
                <PaymentMethodsPickerModal
                    visible={isPaymentMethodsModalVisible}
                    options={paymentMethodOptions}
                    isLoading={isPaymentMethodsLoading}
                    onClose={onClosePaymentMethodsModal}
                    onConfirm={onConfirmPaymentMethods}
                />
            )}
            {isConfirmationRequiredModalVisible && (
                <SingleSelectModal
                    visible={isConfirmationRequiredModalVisible}
                    title={confirmationRequiredModalTitle}
                    onClose={onCloseConfirmationRequiredModal}
                    items={confirmationRequiredItems}
                    onConfirm={onConfirmConfirmationRequired}
                />
            )}
            {isCurrencyModalVisible && (
                <CurrencyModal
                    visible={isCurrencyModalVisible}
                    onClose={onCloseCurrencyModal}
                    items={currencyItems}
                    selectedValue={currencyDraft}
                    onConfirm={onConfirmCurrency}
                />
            )}
        </>
    );
};
