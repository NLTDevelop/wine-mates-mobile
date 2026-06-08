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
import { CalendarIcon } from '@assets/icons/CalendarIcon';
import { DateTimePickerModal } from '@/UIKit/DateTimePickerModal';
import { useDateTimePicker } from './presenters/useDateTimePicker';
import { useEventTypeModal } from './presenters/useEventTypeModal';
import { useSexModal } from './presenters/useSexModal';
import { useParticipationConditionModal } from './presenters/useParticipationConditionModal';
import { useConfirmationRequiredModal } from './presenters/useConfirmationRequiredModal';
import { usePaymentMethodsModal } from './presenters/usePaymentMethodsModal';
import { useContactInfoModal } from './presenters/useContactInfoModal';
import { useEventDateTimeFormatter } from './presenters/useEventDateTimeFormatter';
import { useEventTypeLabel } from './presenters/useEventTypeLabel';
import { PaymentMethodsPickerModal } from './components/PaymentMethodsPickerModal';
import { ContactInfoPickerModal } from './components/ContactInfoPickerModal';
import { SingleSelectModal } from './components/SingleSelectModal';
import { PickerButton } from '@/UIKit/PickerButton';
import { CalendarModal } from '@/UIKit/CalendarModal';
import { LanguageSelector } from '@/libs/languagePicker/components/LanguageSelector';
import { ClockIcon } from '@assets/icons/ClockIcon';
import { RangeSlider } from '@/UIKit/RangeSlider';
import { CurrencyPickerBottomSheet } from '@/UIKit/CurrencyPicker/ui';
import { useCurrencyPickerModal } from '@/UIKit/CurrencyPicker/presenters/useCurrencyPickerModal';
import { useKeyboardStickyLayout } from '@/hooks/useKeyboardStickyLayout';

export const AddEventView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        form,
        headerTitleKey,
        isLoading,
        isPaymentMethodsLoading,
        isContactInfoLoading,
        isPartyEventType,
        paymentMethods,
        contacts,
        currencies,
        isPaymentMethodsDisabled,
        isCurrencyDisabled,
        isPriceFieldAvailable,
        isSeatsError,
        disabled,
        onChangeTheme,
        onChangeDescription,
        onChangeRestaurantName,
        onChangeSpeakerName,
        onStartDateSelect,
        onEndDateSelect,
        onStartTimeSelect,
        onEndTimeSelect,
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
        onChangeContactInfoIds,
        onLocationPress,
        onOpenPaymentsPress,
        onOpenContactsPress,
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
        priceInputHelperText,
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

    const isCurrencyPickerDisabled = isCurrencyDisabled || !currencies.length;
    const { scrollBottomOffset, extraKeyboardSpace, stickyOpenedOffset, onStickyLayout } = useKeyboardStickyLayout();

    const currencyPicker = useCurrencyPickerModal({
        value: form.currency,
        currencies,
        onChange: onChangeCurrency,
        isDisabled: isCurrencyPickerDisabled,
    });

    const {
        isVisible: isPaymentMethodsModalVisible,
        options: paymentMethodOptions,
        selectedText: selectedPaymentMethodsText,
        onOpen: onOpenPaymentMethodsModal,
        onClose: onClosePaymentMethodsModal,
        onConfirm: onConfirmPaymentMethods,
        onOpenPayments: onOpenPaymentsFromModal,
    } = usePaymentMethodsModal({
        value: form.paymentMethodIds,
        paymentMethods,
        onChange: onChangePaymentMethodIds,
        onOpenPaymentsPress,
        isDisabled: isPaymentMethodsDisabled,
    });

    const {
        isVisible: isContactInfoModalVisible,
        options: contactInfoOptions,
        selectedText: selectedContactInfoText,
        onOpen: onOpenContactInfoModal,
        onClose: onCloseContactInfoModal,
        onConfirm: onConfirmContactInfo,
        onOpenContacts: onOpenContactsFromModal,
    } = useContactInfoModal({
        value: form.contactIds,
        contacts,
        onChange: onChangeContactInfoIds,
        onOpenContactsPress,
    });

    return (
        <>
            <ScreenContainer
                edges={['top', 'bottom']}
                headerComponent={
                    <HeaderWithBackButton
                        title={t(headerTitleKey)}
                        isCentered={true}
                    />
                }
                withGradient
            >
                <View style={styles.container}>
                    <KeyboardAwareScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.contentContainerStyle}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        bottomOffset={scrollBottomOffset}
                        extraKeyboardSpace={extraKeyboardSpace}
                    >
                        <View style={styles.content}>
                            <Typography variant="h4" text={t('event.basicInfo')} />

                            <PickerButton
                                onPress={onOpenEventTypeModal}
                                text={eventTypeLabel || t('event.eventType')}
                            />
                            <PickerButton
                                onPress={onOpenConfirmationRequiredModal}
                                text={selectedConfirmationRequiredText}
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
                            {isPartyEventType && (
                                <>
                                    <Typography variant="h6" text={t('eventFilters.age')} />
                                    <RangeSlider
                                        min={18}
                                        max={100}
                                        minValue={form.minAge}
                                        maxValue={form.maxAge}
                                        onChange={onAgeRangeChange}
                                    />
                                    <PickerButton
                                        onPress={onOpenSexModal}
                                        text={selectedSexText}
                                    />
                                    <PickerButton
                                        onPress={onOpenParticipationConditionModal}
                                        text={selectedParticipationConditionText}
                                    />
                                </>
                            )}

                            <LanguageSelector value={form.language} onChange={onChangeLanguage} />

                            <CustomInput
                                value={form.description}
                                containerStyle={styles.inputContainerStyle}
                                inputContainerStyle={styles.descriptionInputContainerStyle}
                                onChangeText={onChangeDescription}
                                placeholder={t('event.description')}
                                multiline
                                maxLength={300}
                            />

                            <Typography variant="h4" text={t('event.locationAndSchedule')} />
                            <CustomInput
                                value={form.restaurantName}
                                containerStyle={styles.inputContainerStyle}
                                onChangeText={onChangeRestaurantName}
                                placeholder={t('event.meetingPlaceName')}
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
                                onPress={onOpenContactInfoModal}
                                text={selectedContactInfoText || t('contactInfo.contacts')}
                            />

                            {isPriceFieldAvailable && (
                                <>
                                    <PickerButton
                                        onPress={onOpenPaymentMethodsModal}
                                        text={selectedPaymentMethodsText || t('payments.paymentsMethods')}
                                        isDisabled={isPaymentMethodsDisabled}
                                    />

                                    <PickerButton
                                        onPress={currencyPicker.onOpen}
                                        text={currencyPicker.selectedText || t('event.currency')}
                                        isDisabled={isCurrencyPickerDisabled}
                                    />
                                </>
                            )}

                            {isPriceFieldAvailable && (
                                <View>
                                    <CustomInput
                                        value={form.price}
                                        containerStyle={styles.inputContainerStyle}
                                        onChangeText={onChangePrice}
                                        placeholder={t('event.price')}
                                        keyboardType="numeric"
                                    />
                                    {!!priceInputHelperText && (
                                        <Typography
                                            variant="subtitle_12_400"
                                            text={priceInputHelperText}
                                            style={styles.priceInputHelperText}
                                        />
                                    )}
                                </View>
                            )}

                            <CustomInput
                                value={form.seats}
                                containerStyle={styles.inputContainerStyle}
                                onChangeText={onChangeSeats}
                                placeholder={t('event.numberOfSeats')}
                                keyboardType="numeric"
                                error={isSeatsError}
                            />
                        </View>
                    </KeyboardAwareScrollView>

                    <KeyboardStickyView
                        offset={{
                            closed: 0,
                            opened: stickyOpenedOffset,
                        }}
                    >
                        <View style={styles.buttonContainer} onLayout={onStickyLayout}>
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
                    onOpenPaymentsPress={onOpenPaymentsFromModal}
                />
            )}
            {isContactInfoModalVisible && (
                <ContactInfoPickerModal
                    visible={isContactInfoModalVisible}
                    options={contactInfoOptions}
                    isLoading={isContactInfoLoading}
                    onClose={onCloseContactInfoModal}
                    onConfirm={onConfirmContactInfo}
                    onOpenContactsPress={onOpenContactsFromModal}
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
            {currencyPicker.isVisible && (
                <CurrencyPickerBottomSheet
                    visible={currencyPicker.isVisible}
                    onClose={currencyPicker.onClose}
                    items={currencyPicker.items}
                    selectedValue={currencyPicker.draft}
                    onConfirm={currencyPicker.onConfirm}
                    title={t('event.currency')}
                />
            )}
        </>
    );
};
