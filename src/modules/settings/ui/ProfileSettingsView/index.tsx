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
import { EditIcon } from '@assets/icons/EditIcon';
import { InstagramIcon } from '@assets/icons/InstagramIcon';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon';
import { useBirthdaySelector } from '@/modules/registration/presenters/useBirthdaySelector';
import { SelectExpertiseBottomSheet } from '../components/SelectExpertiseBottomSheet';

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
    } = useProfileSettings();
    const { handlePress: onPressBirthday, isOpened, pickerDate, setPickerDate } = useBirthdaySelector(
        (value) => onChangeField('birthday', value)
    );

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            scrollEnabled
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
                        <View style={styles.expertiseContainer}>
                            <Typography text={t('settings.expertise')} variant="body_500" style={styles.expertiseTitle} />
                            <Pressable style={styles.expertiseRow} onPress={onOpenExpertiseModal}>
                                <Avatar
                                    size={24}
                                    avatarUrl={avatarUrl}
                                    fullname={form.fullName}
                                />
                                <Typography
                                    text={t(`wineLevel.${expertiseLevel}`)}
                                    variant="body_500"
                                    style={styles.expertiseValue}
                                />
                                <NextArrowIcon color={colors.icon} />
                            </Pressable>
                        </View>
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
                    <View style={styles.input}>
                        <CustomDropdown
                            data={countryOptions}
                            placeholder={t('settings.country')}
                            onPress={item => onChangeField('country', String(item.value))}
                            selectedValue={form.country}
                            disabled={!isEditing}
                        />
                    </View>
                    <CustomInput
                        value={form.city}
                        onChangeText={(value) => onChangeField('city', value)}
                        editable={isEditing}
                        placeholder={t('settings.city')}
                        containerStyle={styles.input}
                    />
                    <View style={styles.input}>
                        <BirthdaySelector
                            date={form.birthday}
                            handlePress={isEditing ? onPressBirthday : () => null}
                            isOpened={isOpened}
                            isError={false}
                            displayText={birthdayDisplayText}
                            disabled={!isEditing}
                        />
                    </View>
                    <View style={styles.input}>
                        <CustomDropdown
                            data={genderOptions}
                            placeholder={t('settings.gender')}
                            onPress={item => onChangeField('gender', String(item.value))}
                            selectedValue={form.gender}
                            disabled={!isEditing}
                        />
                    </View>
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
                        placeholder={t('settings.socialMediaLinks')}
                        LeftAccessory={(
                            <View style={styles.instagramAccessory}>
                                <InstagramIcon color={colors.text} />
                            </View>
                        )}
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
            {isOpened && isEditing && (
                <View style={styles.pickerWrapper}>
                    <DatePicker
                        locale={locale}
                        mode="date"
                        date={pickerDate}
                        onDateChange={setPickerDate}
                        theme={theme}
                    />
                </View>
            )}
            <SelectExpertiseBottomSheet
                modalRef={selectExpertiseModalRef}
                selectedValue={expertiseLevel}
                onSelect={onSelectExpertise}
                onClose={onCloseExpertiseModal}
            />
        </ScreenContainer>
    );
};
