import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { CustomInput } from '@/UIKit/CustomInput';
import { Button } from '@/UIKit/Button';
import { Typography } from '@/UIKit/Typography';
import { useEditProfileDetails } from './presenters/useEditProfileDetails';
import { AvatarPicker } from '@/UIKit/AvatarPicker/ui';
import { PhoneInputField } from '@/libs/countryCodePicker/components/PhoneInputField';
import { CustomDropdown } from '@/UIKit/CustomDropdown/ui';
import { BirthdaySelector } from '@/modules/registration/ui/components/BirthdaySelector';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { InstagramIcon } from '@assets/icons/InstagramIcon';
import { SelectExpertiseBottomSheet } from './components/SelectExpertiseBottomSheet';
import { ExpertiseSelectorRow } from './components/ExpertiseSelectorRow';
import { CitySelectorRow } from './components/CitySelectorRow';
import { SelectCityBottomSheet } from './components/SelectCityBottomSheet';
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum.ts';
import { WineLoverIcon } from '@assets/icons/WineLoverIcon.tsx';
import { WineExpertIcon } from '@assets/icons/WineExpertIcon.tsx';
import { WinemakerIcon } from '@assets/icons/WinemakerIcon.tsx';
import { isIOS, scaleHorizontal, scaleVertical } from '@/utils';

const EXPERTISE_SIZE = scaleHorizontal(16);

export const EditProfileDetailsView = () => {
    const { colors, t, locale, theme } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        form,
        phoneInitialCca2,
        avatarUrl,
        selectedAvatarUri,
        hasAvatar,
        isMarkedForDeletion,
        onOpenCamera,
        onRemoveAvatar,
        onCancelDeletion,
        expertiseLevel,
        birthdayDisplayText,
        genderOptions,
        countryOptions,
        cityOptions,
        citySearch,
        cityEmptyStateText,
        isCitySelectorDisabled,
        isCityLoading,
        onChangeField,
        onChangeCountry,
        cityModalRef,
        onOpenCitySelector,
        onCloseCitySelector,
        onSearchCityChange,
        onSelectCityOption,
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
        instagramLinkError,
        isDeleteAvatarAlertVisible,
        onCloseDeleteAvatarAlert,
        onConfirmDeleteAvatar,
        onEditModeBackHandler,
    } = useEditProfileDetails();

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={
                <HeaderWithBackButton title={t('settings.profileSettings')} onPressBack={onEditModeBackHandler} />
            }
        >
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    bottomOffset={scaleVertical(82)}
                >
                    <View style={styles.content}>
                        <View style={styles.avatarContainer}>
                            <AvatarPicker
                                size={72}
                                avatarUrl={avatarUrl}
                                fullname={form.fullName}
                                isEditing
                                selectedImageUri={selectedAvatarUri}
                                hasAvatar={hasAvatar}
                                isMarkedForDeletion={isMarkedForDeletion}
                                onPress={onOpenCamera}
                                onRemove={onRemoveAvatar}
                                onCancelDeletion={onCancelDeletion}
                            />
                            <View style={styles.roleContainer}>
                                <Typography
                                    text={
                                        expertiseLevel === 'lover'
                                            ? t('registration.wineLover')
                                            : expertiseLevel === 'expert'
                                              ? t('registration.wineExpert')
                                              : t('registration.winemaker')
                                    }
                                    variant="subtitle_12_500"
                                    style={styles.roleText}
                                />
                                {expertiseLevel === WineExperienceLevelEnum.LOVER && (
                                    <WineLoverIcon width={EXPERTISE_SIZE} height={EXPERTISE_SIZE} />
                                )}
                                {expertiseLevel === WineExperienceLevelEnum.EXPERT && (
                                    <WineExpertIcon width={EXPERTISE_SIZE} height={EXPERTISE_SIZE} />
                                )}
                                {expertiseLevel === WineExperienceLevelEnum.CREATOR && (
                                    <WinemakerIcon width={EXPERTISE_SIZE} height={EXPERTISE_SIZE} />
                                )}
                            </View>
                        </View>

                        <ExpertiseSelectorRow expertiseLevel={expertiseLevel} onPress={onOpenExpertiseModal} />

                        <CustomInput
                            value={form.fullName}
                            onChangeText={value => onChangeField('fullName', value)}
                            editable
                            placeholder={t('settings.fullName')}
                            containerStyle={styles.input}
                        />
                        <CustomInput
                            value={form.email}
                            onChangeText={value => onChangeField('email', value)}
                            editable
                            placeholder={t('settings.email')}
                            containerStyle={styles.input}
                        />
                        <View style={styles.input}>
                            <PhoneInputField
                                value={form.phoneNumber}
                                onChangeText={value => onChangeField('phoneNumber', value)}
                                onChangeCountryCode={onChangeCountryCode}
                                editable
                                initialCca2={phoneInitialCca2}
                            />
                        </View>
                        <CustomDropdown
                            data={countryOptions}
                            placeholder={t('settings.country')}
                            onPress={onChangeCountry}
                            withSearch
                            selectedValue={form.country}
                            disabled={false}
                            containerStyle={styles.input}
                        />
                        <CitySelectorRow
                            value={form.city}
                            placeholder={t('settings.city')}
                            disabled={isCitySelectorDisabled}
                            onPress={onOpenCitySelector}
                        />
                        <View style={styles.input}>
                            <BirthdaySelector
                                date={form.birthday}
                                handlePress={onOpenBirthdayModal}
                                isOpened={isBirthdayModalVisible}
                                isError={false}
                                displayText={birthdayDisplayText}
                                disabled={false}
                            />
                        </View>
                        <CustomDropdown
                            data={genderOptions}
                            placeholder={t('settings.gender')}
                            onPress={item => onChangeField('gender', String(item.value))}
                            selectedValue={form.gender}
                            disabled={false}
                            containerStyle={styles.input}
                        />
                        <CustomInput
                            value={form.occupation}
                            onChangeText={value => onChangeField('occupation', value)}
                            editable
                            placeholder={t('settings.occupation')}
                            containerStyle={styles.input}
                        />
                        <CustomInput
                            value={form.placeOfWork}
                            onChangeText={value => onChangeField('placeOfWork', value)}
                            editable
                            placeholder={t('settings.placeOfWork')}
                            containerStyle={styles.input}
                        />
                        <CustomInput
                            value={form.instagramLink}
                            onChangeText={value => onChangeField('instagramLink', value)}
                            editable
                            placeholder={t('settings.instagram')}
                            error={!!instagramLinkError}
                            errorText={instagramLinkError || undefined}
                            LeftAccessory={
                                <View style={styles.instagramAccessory}>
                                    <InstagramIcon color={colors.text} />
                                </View>
                            }
                            containerStyle={styles.input}
                        />
                        <CustomInput
                            value={form.website}
                            onChangeText={value => onChangeField('website', value)}
                            editable
                            placeholder={t('settings.website')}
                            containerStyle={styles.input}
                        />
                        <CustomInput
                            value={form.bio}
                            onChangeText={value => onChangeField('bio', value)}
                            editable
                            placeholder={t('settings.bio')}
                            multiline
                            inputContainerStyle={styles.bigInput}
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
                            text={t('common.save')}
                            onPress={onSave}
                            type="main"
                            disabled={isDisabled}
                            inProgress={isInProgress}
                        />
                    </View>
                </KeyboardStickyView>
            </View>

            <SelectExpertiseBottomSheet
                modalRef={selectExpertiseModalRef}
                selectedValue={expertiseLevel}
                onSelect={onSelectExpertise}
                onClose={onCloseExpertiseModal}
            />
            <SelectCityBottomSheet
                modalRef={cityModalRef}
                value={citySearch}
                data={cityOptions}
                isLoading={isCityLoading}
                emptyText={cityEmptyStateText}
                onChangeText={onSearchCityChange}
                onSelect={onSelectCityOption}
                onClose={onCloseCitySelector}
            />
            <BottomModal
                visible={isBirthdayModalVisible}
                onClose={onCloseBirthdayModal}
                customHeader={
                    <View style={styles.birthdayModalHeader}>
                        <Pressable onPress={onCloseBirthdayModal} style={styles.birthdayModalButton}>
                            <Typography text="✕" variant="h4" />
                        </Pressable>
                        <Typography text={t('registration.birthday')} variant="h4" />
                        <Pressable onPress={onConfirmBirthday} style={styles.birthdayModalButton}>
                            <Typography text="OK" variant="h6" />
                        </Pressable>
                    </View>
                }
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
                    <Typography
                        text={t('settings.deleteProfilePhotoMessage')}
                        variant="subtitle_12_400"
                        style={styles.alertMessage}
                    />
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
