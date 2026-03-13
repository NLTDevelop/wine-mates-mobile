import { useMemo } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { CustomInput } from '@/UIKit/CustomInput';
import { Button } from '@/UIKit/Button';
import { Typography } from '@/UIKit/Typography';
import { useAddEvent } from '../../presenters/useAddEvent';
import { LocationPickerModal } from '../components/LocationPickerModal';
import { MapLocationIcon } from '@assets/icons/MapLocationIcon';
import { PhoneInputField } from '@/libs/countryCodePicker/components/PhoneInputField';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { DateTimePickerModal } from '../components/DateTimePickerModal';
import { useDateTimePicker } from '../components/DateTimePickerModal/presenters/useDateTimePicker';
import { useEventDateTimeFormatter } from '../../presenters/useEventDateTimeFormatter';

export const AddEventView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        form,
        isLoading,
        disabled,
        isLocationModalVisible,
        onChangeTastingTheme,
        onChangeRestaurant,
        onChangeLocation,
        onDateSelect,
        onTimeSelect,
        onChangePhoneNumber,
        onChangePrice,
        onChangeEventLanguage,
        onChangeNumberOfSeats,
        onLocationPress,
        onCloseLocationModal,
        onSubmit,
    } = useAddEvent();

    const {
        isVisible,
        mode,
        pickerDate,
        openDatePicker,
        openTimePicker,
        onClose,
        onConfirm,
        onDateChange,
    } = useDateTimePicker({ onDateSelect, onTimeSelect });

    const { formattedDate, formattedTime } = useEventDateTimeFormatter({
        eventDate: form.eventDate,
        eventTime: form.eventTime,
    });

    return (
        <>
            <ScreenContainer
                edges={[]}
                scrollEnabled
                headerComponent={<HeaderWithBackButton title={t('event.addEvent')} isCentered={false} />}
                isKeyboardAvoiding
            >
            <View style={styles.contentContainerStyle}>
                <CustomInput
                    value={form.tastingTheme}
                    containerStyle={styles.inputContainerStyle}
                    onChangeText={onChangeTastingTheme}
                    placeholder={t('event.tastingTheme')}
                    maxLength={80}
                />

                <CustomInput
                    value={form.restaurant}
                    containerStyle={styles.inputContainerStyle}
                    onChangeText={onChangeRestaurant}
                    placeholder={t('event.restaurant')}
                    maxLength={30}
                />

                <TouchableOpacity onPress={onLocationPress} style={styles.locationButton}>
                    <Typography
                        text={form.location ? `${form.location.latitude.toFixed(6)}, ${form.location.longitude.toFixed(6)}` : t('event.selectLocation')}
                        variant="h6"
                        style={styles.locationText}
                    />
                    <MapLocationIcon color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity onPress={openDatePicker} onPressIn={Keyboard.dismiss} style={styles.pickerButton}>
                    <Typography
                        variant="h6"
                        text={formattedDate || t('event.eventDate')}
                        style={!formattedDate ? styles.placeholderText : undefined}
                    />
                    <ArrowDownIcon />
                </TouchableOpacity>

                <TouchableOpacity onPress={openTimePicker} onPressIn={Keyboard.dismiss} style={styles.pickerButton}>
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
                    value={form.eventLanguage}
                    containerStyle={styles.inputContainerStyle}
                    onChangeText={onChangeEventLanguage}
                    placeholder={t('event.eventLanguage')}
                />

                <CustomInput
                    value={form.numberOfSeats}
                    containerStyle={styles.inputContainerStyle}
                    onChangeText={onChangeNumberOfSeats}
                    placeholder={t('event.numberOfSeats')}
                    keyboardType="numeric"
                />

                <Button
                    text={t('event.createEvent')}
                    onPress={onSubmit}
                    type="secondary"
                    disabled={disabled}
                    inProgress={isLoading}
                    containerStyle={styles.submitButton}
                />
            </View>

            </ScreenContainer>

            <LocationPickerModal
                visible={isLocationModalVisible}
                onClose={onCloseLocationModal}
                onSelectLocation={onChangeLocation}
                initialLocation={form.location}
            />

            <DateTimePickerModal
                visible={isVisible}
                mode={mode}
                date={pickerDate}
                onClose={onClose}
                onConfirm={onConfirm}
                onDateChange={onDateChange}
            />
        </>
    );
};
