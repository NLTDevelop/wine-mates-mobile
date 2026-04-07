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
import { AvatarPicker } from '@/UIKit/AvatarPicker/ui';
import { PhoneInputField } from '@/libs/countryCodePicker/components/PhoneInputField';
import { CustomDropdown } from '@/UIKit/CustomDropdown/ui';
import { BirthdaySelector } from '@/modules/registration/ui/components/BirthdaySelector';
import DatePicker from 'react-native-date-picker';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { EditIcon } from '@assets/icons/EditIcon';
import { InstagramIcon } from '@assets/icons/InstagramIcon';
import { useBirthdaySelector } from '@/modules/registration/presenters/useBirthdaySelector';
import { SelectExpertiseBottomSheet } from '../components/SelectExpertiseBottomSheet';
import { ExpertiseSelectorRow } from './components/ExpertiseSelectorRow';
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum.ts';
import { WineLoverIcon } from '@assets/icons/WineLoverIcon.tsx';
import { WineExpertIcon } from '@assets/icons/WineExpertIcon.tsx';
import { WinemakerIcon } from '@assets/icons/WinemakerIcon.tsx';
import { scaleHorizontal } from '@/utils';

const EXPERTISE_SIZE = scaleHorizontal(16);

export const ProfileSettingsView = () => {
    const { colors, t, locale, theme } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        form,
        avatarUrl,
        selectedAvatarUri,
        hasAvatar,
        isMarkedForDeletion,
        onOpenCamera,
        onRemoveAvatar,
        onCancelDeletion,
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
        instagramLinkError,
        isDeleteAvatarAlertVisible,
        onCloseDeleteAvatarAlert,
        onConfirmDeleteAvatar,
        onEditModeBackHandler,
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
                    onPressBack={onEditModeBackHandler}
                    isCentered={false}
                    rightComponent={!isEditing ? (
                        <Pressable onPress={onToggleEdit} style={styles.editButton}>
                            <EditIcon width={20} height={20} color={colors.text} />
                        </Pressable>
                    ) : undefined}
                />
            )}
            isKeyboardAvoiding
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.avatarContainer}>
                        <AvatarPicker
                            size={72}
                            avatarUrl={avatarUrl}
                            fullname={form.fullName}
                            isEditing={isEditing}
                            selectedImageUri={selectedAvatarUri}
                            hasAvatar={hasAvatar}
                            isMarkedForDeletion={isMarkedForDeletion}
                            onPress={onOpenCamera}
                            onRemove={onRemoveAvatar}
                            onCancelDeletion={onCancelDeletion}
                        />
                        <View style={styles.roleContainer}>
                            <Typography
                                text={expertiseLevel === 'lover' ? t('registration.wineLover') : expertiseLevel === 'expert' ? t('registration.wineExpert') : t('registration.winemaker')}
                                variant="subtitle_12_500"
                                style={styles.roleText}
                            />
                            {expertiseLevel === WineExperienceLevelEnum.LOVER && <WineLoverIcon width={EXPERTISE_SIZE} height={EXPERTISE_SIZE} />}
                            {expertiseLevel === WineExperienceLevelEnum.EXPERT && <WineExpertIcon width={EXPERTISE_SIZE} height={EXPERTISE_SIZE} />}
                            {expertiseLevel === WineExperienceLevelEnum.CREATOR && <WinemakerIcon width={EXPERTISE_SIZE} height={EXPERTISE_SIZE} />}
                        </View>
                    </View>
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
                        error={!!instagramLinkError}
                        errorText={instagramLinkError || undefined}
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
                    <View style={styles.birthdayModalHeader}>
                        <Pressable onPress={onCloseBirthdayModal} style={styles.birthdayModalButton}>
                            <Typography text="✕" variant="h4" />
                        </Pressable>
                        <Typography text={t('registration.birthday')} variant="h4" />
                        <Pressable onPress={onConfirmBirthday} style={styles.birthdayModalButton}>
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
            <CustomAlert
                visible={isDeleteAvatarAlertVisible}
                onClose={onCloseDeleteAvatarAlert}
                header={t('settings.deleteProfilePhotoTitle')}
                content={
                    <Typography text={t('settings.deleteProfilePhotoMessage')} variant="subtitle_12_400" style={styles.alertMessage} />
                }
                footer={
                    <View style={styles.alertFooter}>
                        <Button
                            text={t('settings.delete')}
                            onPress={onConfirmDeleteAvatar}
                            type="main"
                            containerStyle={styles.alertButton}
                        />
                        <Button
                            text={t('common.cancel')}
                            onPress={onCloseDeleteAvatarAlert}
                            type="secondary"
                            containerStyle={styles.alertButton}
                        />
                    </View>
                }
            />
        </ScreenContainer>
    );
};
