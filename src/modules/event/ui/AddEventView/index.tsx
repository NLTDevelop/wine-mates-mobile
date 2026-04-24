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
import { useAddEvent } from '../../presenters/useAddEvent';
import { MapLocationIcon } from '@assets/icons/MapLocationIcon';
import { PhoneInputField } from '@/libs/countryCodePicker/components/PhoneInputField';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { DateTimePickerModal } from '@/UIKit/DateTimePickerModal';
import { useDateTimePicker } from './presenters/useDateTimePicker';
import { useEventDateTimeFormatter } from '../../presenters/useEventDateTimeFormatter';
import { useEventTypeLabel } from '../../presenters/useEventTypeLabel';
import { EventTypePickerModal } from './components/EventTypePickerModal';
import { isIOS, scaleVertical } from '@/utils';

export const AddEventView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        form,
        eventTypeDraft,
        isLoading,
        isEventTypeModalVisible,
        disabled,
        onChangeTheme,
        onChangeDescription,
        onChangeRestaurantName,
        onChangeSpeakerName,
        onDateSelect,
        onTimeSelect,
        onChangePhoneNumber,
        onChangePrice,
        onChangeLanguage,
        onChangeSeats,
        onOpenEventTypeModal,
        onCloseEventTypeModal,
        onSelectEventType,
        onConfirmEventType,
        onLocationPress,
        onSubmit,
    } = useAddEvent();

    const {
        isVisible,
        isTimePickerDisabled,
        mode,
        pickerDate,
        minimumDate,
        openDatePicker,
        openTimePicker,
        onClose,
        onConfirm,
        onDateChange,
    } = useDateTimePicker({
        onDateSelect,
        onTimeSelect,
        selectedEventDate: form.eventDate,
        selectedEventTime: form.eventTime,
        t,
    });

    const { formattedDate, formattedTime } = useEventDateTimeFormatter({
        eventDate: form.eventDate,
        eventTime: form.eventTime,
    });
    const eventTypeLabel = useEventTypeLabel({ eventType: form.eventType, t });

    return (
        <>
            <ScreenContainer
                edges={['top', 'bottom']}
                headerComponent={<HeaderWithBackButton title={t('event.addEvent')} isCentered={false} />}
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
                            <CustomInput
                                value={form.theme}
                                containerStyle={styles.inputContainerStyle}
                                onChangeText={onChangeTheme}
                                placeholder={t('event.tastingTheme')}
                                maxLength={300}
                            />

                            <CustomInput
                                value={form.restaurantName}
                                containerStyle={styles.inputContainerStyle}
                                onChangeText={onChangeRestaurantName}
                                placeholder={t('event.restaurant')}
                            />

                            <CustomInput
                                value={form.speakerName}
                                containerStyle={styles.inputContainerStyle}
                                onChangeText={onChangeSpeakerName}
                                placeholder={t('event.speakerName')}
                            />

                            <CustomInput
                                value={form.description}
                                containerStyle={styles.inputContainerStyle}
                                inputContainerStyle={styles.descriptionInputContainerStyle}
                                onChangeText={onChangeDescription}
                                placeholder={t('event.shortDescription')}
                                multiline
                                maxLength={300}
                            />

                            <TouchableOpacity onPress={onLocationPress} style={styles.locationButton}>
                                <Typography
                                    text={form.locationLabel || t('event.selectLocation')}
                                    variant="h6"
                                    style={styles.locationText}
                                />
                                <MapLocationIcon color={colors.text} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={openDatePicker}
                                onPressIn={Keyboard.dismiss}
                                style={styles.pickerButton}
                            >
                                <Typography
                                    variant="h6"
                                    text={formattedDate || t('event.eventDate')}
                                    style={!formattedDate ? styles.placeholderText : undefined}
                                />
                                <ArrowDownIcon />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={openTimePicker}
                                onPressIn={Keyboard.dismiss}
                                disabled={isTimePickerDisabled}
                                style={[
                                    styles.pickerButton,
                                    isTimePickerDisabled ? styles.disabledPickerButton : undefined,
                                ]}
                            >
                                <Typography
                                    variant="h6"
                                    text={formattedTime || t('event.eventTime')}
                                    style={!formattedTime ? styles.placeholderText : undefined}
                                />
                                <ArrowDownIcon />
                            </TouchableOpacity>

                            <PhoneInputField
                                value={form.phoneNumber}
                                onChangeText={onChangePhoneNumber}
                                placeholder={t('event.phoneNumber')}
                            />

                            <CustomInput
                                value={form.price}
                                containerStyle={styles.inputContainerStyle}
                                onChangeText={onChangePrice}
                                placeholder={t('event.price')}
                                keyboardType="numeric"
                            />

                            <CustomInput
                                value={form.language}
                                containerStyle={styles.inputContainerStyle}
                                onChangeText={onChangeLanguage}
                                placeholder={t('event.eventLanguage')}
                            />

                            <CustomInput
                                value={form.seats}
                                containerStyle={styles.inputContainerStyle}
                                onChangeText={onChangeSeats}
                                placeholder={t('event.numberOfSeats')}
                                keyboardType="numeric"
                            />

                            <TouchableOpacity
                                onPress={onOpenEventTypeModal}
                                onPressIn={Keyboard.dismiss}
                                style={styles.pickerButton}
                            >
                                <Typography variant="h6" text={eventTypeLabel || t('event.eventType')} />
                                <ArrowDownIcon />
                            </TouchableOpacity>
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
                                text={t('event.createEvent')}
                                onPress={onSubmit}
                                type="secondary"
                                disabled={disabled}
                                inProgress={isLoading}
                            />
                        </View>
                    </KeyboardStickyView>
                </View>
            </ScreenContainer>

            <DateTimePickerModal
                visible={isVisible}
                mode={mode}
                date={pickerDate}
                minimumDate={minimumDate}
                onClose={onClose}
                onConfirm={onConfirm}
                onDateChange={onDateChange}
            />
            <EventTypePickerModal
                visible={isEventTypeModalVisible}
                selectedType={eventTypeDraft}
                onClose={onCloseEventTypeModal}
                onSelectType={onSelectEventType}
                onConfirm={onConfirmEventType}
            />
        </>
    );
};
