import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { CustomInput } from '@/UIKit/CustomInput';
import { Button } from '@/UIKit/Button';
import { Typography } from '@/UIKit/Typography';
import { useProfileSettings } from '../../presenters/useProfileSettings';
import { Avatar } from '@/UIKit/Avatar';
import { PhoneInputField } from '@/libs/countryCodePicker/components/PhoneInputField';
import { CustomDropdown } from '@/UIKit/CustomDropdown/ui';
import { BirthdaySelector } from '@/modules/registration/ui/components/BirthdaySelector';
import DatePicker from 'react-native-date-picker';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { EditIcon } from '@assets/icons/EditIcon';
import { InstagramIcon } from '@assets/icons/InstagramIcon';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { useBirthdaySelector } from '@/modules/registration/presenters/useBirthdaySelector';
import { SelectExpertiseBottomSheet } from '../components/SelectExpertiseBottomSheet';
import { ExpertiseSelectorRow } from './components/ExpertiseSelectorRow';

export const ProfileSettingsView = () => {
    const { colors, t, locale, theme } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        form,
        avatarUrl,
        expertiseLevel,
        birthdayDisplayText,
        isEditing,
        genderOptions,
        countryOptions,
        cityOptions,
        onToggleEdit,
        onChangeField,
        onChangeCountryCode,
        selectExpertiseModalRef,
        onOpenExpertiseModal,
        onCloseExpertiseModal,
        onSelectExpertise,
        onSave,
        isDisabled,
        isInProgress,
        isBirthdayModalVisible,
        pickerDate,
        onOpenBirthdayModal,
        onCloseBirthdayModal,
        onChangePickerDate,
        onConfirmBirthday,
        onSearchCity,
    } = useProfileSettings();
    const { scrollRef } = useBirthdaySelector(() => {});

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            scrollEnabled
            scrollRef={scrollRef}
            headerComponent={(
                <HeaderWithBackButton
                    title={t('settings.profileSettings')}
                    isCentered={false}
                    rightComponent={(
                    <Pressable onPress={onToggleEdit} style={styles.editButton}>
                            {isEditing ? (
                                <CrossIcon width={20} height={20} color={colors.text_light} />
                            ) : (
                                <EditIcon width={20} height={20} color={colors.text} />
                            )}
                        </Pressable>
                    )}
                />
            )}
            isKeyboardAvoiding
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <Avatar
                        size={64}
                        avatarUrl={avatarUrl}
                        fullname={form.fullName}
                        containerStyle={styles.avatar}
                    />
                    {isEditing && (
                        <ExpertiseSelectorRow expertiseLevel={expertiseLevel} onPress={onOpenExpertiseModal} />
                    )}
                    <CustomInput
                        value={form.fullName}
                        onChangeText={(value) => onChangeField('fullName', value)}
                        editable={isEditing}
                        placeholder={t('settings.fullName')}
                        containerStyle={styles.input}
                    />
                    <CustomInput
                        value={form.email}
                        onChangeText={(value) => onChangeField('email', value)}
                        editable={isEditing}
                        placeholder={t('settings.email')}
                        containerStyle={styles.input}
                    />
                    <View style={styles.input}>
                        <PhoneInputField
                            value={form.phoneNumber}
                            onChangeText={(value) => onChangeField('phoneNumber', value)}
                            onChangeCountryCode={onChangeCountryCode}
                            editable={isEditing}
                            initialCca2={form.country || null}
                        />
                    </View>
                    <CustomDropdown
                        data={countryOptions}
                        placeholder={t('settings.country')}
                        onPress={item => onChangeField('country', String(item.value))}
                        withSearch
                        selectedValue={form.country}
                        disabled={!isEditing}
                        containerStyle={styles.input}
                    />
                    <CustomDropdown
                        data={cityOptions}
                        placeholder={t('settings.city')}
                        onPress={item => onChangeField('city', String(item.value))}
                        withSearch
                        selectedValue={form.city}
                        disabled={!isEditing}
                        containerStyle={styles.input}
                        onSearchChange={onSearchCity}
                        disableLocalFilter
                    />
                    <View style={styles.input}>
                        <BirthdaySelector
                            date={form.birthday}
                            handlePress={onOpenBirthdayModal}
                            isOpened={isBirthdayModalVisible}
                            isError={false}
                            displayText={birthdayDisplayText}
                            disabled={!isEditing}
                        />
                    </View>
                    <CustomDropdown
                        data={genderOptions}
                        placeholder={t('settings.gender')}
                        onPress={item => onChangeField('gender', String(item.value))}
                        selectedValue={form.gender}
                        disabled={!isEditing}
                        containerStyle={styles.input}
                    />
                    <CustomInput
                        value={form.occupation}
                        onChangeText={(value) => onChangeField('occupation', value)}
                        editable={isEditing}
                        placeholder={t('settings.occupation')}
                        containerStyle={styles.input}
                    />
                    <CustomInput
                        value={form.placeOfWork}
                        onChangeText={(value) => onChangeField('placeOfWork', value)}
                        editable={isEditing}
                        placeholder={t('settings.placeOfWork')}
                        containerStyle={styles.input}
                    />
                    <CustomInput
                        value={form.instagramLink}
                        onChangeText={(value) => onChangeField('instagramLink', value)}
                        editable={isEditing}
                        placeholder={t('settings.instagram')}
                        LeftAccessory={(
                            <View style={styles.instagramAccessory}>
                                <InstagramIcon color={colors.text} />
                            </View>
                        )}
                        containerStyle={styles.input}
                    />
                    <CustomInput
                        value={form.website}
                        onChangeText={(value) => onChangeField('website', value)}
                        editable={isEditing}
                        placeholder={t('settings.website')}
                        containerStyle={styles.input}
                    />
                    <CustomInput
                        value={form.bio}
                        onChangeText={(value) => onChangeField('bio', value)}
                        editable={isEditing}
                        placeholder={t('settings.bio')}
                        multiline
                        containerStyle={styles.input}
                    />
                </View>

                {isEditing && (
                    <View style={styles.buttonContainer}>
                        <Button
                            text={t('common.save')}
                            onPress={onSave}
                            type="secondary"
                            disabled={isDisabled}
                            inProgress={isInProgress}
                        />
                    </View>
                )}
            </View>
            <SelectExpertiseBottomSheet
                modalRef={selectExpertiseModalRef}
                selectedValue={expertiseLevel}
                onSelect={onSelectExpertise}
                onClose={onCloseExpertiseModal}
            />
            <BottomModal
                visible={isBirthdayModalVisible && isEditing}
                onClose={onCloseBirthdayModal}
                customHeader={(
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16 }}>
                        <Pressable onPress={onCloseBirthdayModal} style={{ padding: 8 }}>
                            <Typography text="✕" variant="h4" />
                        </Pressable>
                        <Typography text={t('registration.birthday')} variant="h4" />
                        <Pressable onPress={onConfirmBirthday} style={{ padding: 8 }}>
                            <Typography text="OK" variant="h6" />
                        </Pressable>
                    </View>
                )}
            >
                <View style={styles.calendarContainer}>
                    <DatePicker
                        style={styles.calendarContainer}
                        locale={locale}
                        mode="date"
                        date={pickerDate}
                        onDateChange={onChangePickerDate}
                        theme={theme}
                    />
                </View>
            </BottomModal>
        </ScreenContainer>
    );
};
