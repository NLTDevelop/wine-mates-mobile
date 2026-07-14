import { useMemo } from 'react';
import { View } from 'react-native';
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
import { DateTimePickerModal } from '@/UIKit/DateTimePickerModal';
import { InstagramIcon } from '@assets/icons/InstagramIcon';
import { SelectExpertiseBottomSheet } from './components/SelectExpertiseBottomSheet';
import { ExpertiseSelectorRow } from './components/ExpertiseSelectorRow';
import { SelectCityBottomSheet } from './components/SelectCityBottomSheet';
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { CurrencyPickerBottomSheet } from '@/UIKit/CurrencyPicker/ui';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum.ts';
import { WineLoverIcon } from '@assets/icons/WineLoverIcon.tsx';
import { WineExpertIcon } from '@assets/icons/WineExpertIcon.tsx';
import { WinemakerIcon } from '@assets/icons/WinemakerIcon.tsx';
import { scaleHorizontal } from '@/utils';
import { ProfileSelectorRow } from './components/ProfileSelectorRow';
import { useKeyboardStickyLayout } from '@/hooks/useKeyboardStickyLayout';
import { Loader } from '@/UIKit/Loader';

const EXPERTISE_SIZE = scaleHorizontal(16);

export const EditProfileDetailsView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { scrollBottomOffset, extraKeyboardSpace, stickyOpenedOffset, onStickyLayout } = useKeyboardStickyLayout();

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
        onChangeFullName,
        onChangeEmail,
        onChangePhoneNumber,
        onChangeGender,
        onChangeOccupation,
        currencyPicker,
        isCurrencySelectorDisabled,
        onChangePlaceOfWork,
        onChangeInstagramLink,
        onChangeWebsite,
        onChangeBio,
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
        isDeferredContentReady,
    } = useEditProfileDetails();
    const headerComponent = (
        <HeaderWithBackButton title={t('settings.profileSettings')} onPressBack={onEditModeBackHandler} />
    );

    if (!isDeferredContentReady) {
        return (
            <ScreenContainer edges={['top', 'bottom']} withGradient headerComponent={headerComponent}>
                <Loader />
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer edges={['top', 'bottom']} withGradient headerComponent={headerComponent}>
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    bottomOffset={scrollBottomOffset}
                    extraKeyboardSpace={extraKeyboardSpace}
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
                            onChangeText={onChangeFullName}
                            editable
                            placeholder={t('settings.fullName')}
                            containerStyle={styles.input}
                        />
                        <CustomInput
                            value={form.email}
                            onChangeText={onChangeEmail}
                            editable
                            placeholder={t('settings.email')}
                            containerStyle={styles.input}
                        />
                        <View style={styles.input}>
                            <PhoneInputField
                                value={form.phoneNumber}
                                onChangeText={onChangePhoneNumber}
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
                        <ProfileSelectorRow
                            value={form.city}
                            placeholder={t('settings.city')}
                            disabled={isCitySelectorDisabled}
                            onPress={onOpenCitySelector}
                        />
                        <View style={styles.input}>
                            <BirthdaySelector
                                date={form.birthday}
                                onPress={onOpenBirthdayModal}
                                isOpened={isBirthdayModalVisible}
                                isError={false}
                                displayText={birthdayDisplayText}
                                disabled={false}
                            />
                        </View>
                        <CustomDropdown
                            data={genderOptions}
                            placeholder={t('settings.gender')}
                            onPress={onChangeGender}
                            selectedValue={form.gender}
                            disabled={false}
                            containerStyle={styles.input}
                        />
                        <CustomInput
                            value={form.occupation}
                            onChangeText={onChangeOccupation}
                            editable
                            placeholder={t('settings.occupation')}
                            containerStyle={styles.input}
                        />
                        <ProfileSelectorRow
                            value={currencyPicker.selectedText}
                            placeholder={t('settings.selectedCurrency')}
                            disabled={isCurrencySelectorDisabled}
                            onPress={currencyPicker.onOpen}
                        />
                        <CustomInput
                            value={form.placeOfWork}
                            onChangeText={onChangePlaceOfWork}
                            editable
                            placeholder={t('settings.placeOfWork')}
                            containerStyle={styles.input}
                        />
                        <CustomInput
                            value={form.instagramLink}
                            onChangeText={onChangeInstagramLink}
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
                            onChangeText={onChangeWebsite}
                            editable
                            placeholder={t('settings.website')}
                            containerStyle={styles.input}
                        />
                        <CustomInput
                            value={form.bio}
                            onChangeText={onChangeBio}
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
                        opened: stickyOpenedOffset,
                    }}
                >
                    <View style={styles.buttonContainer} onLayout={onStickyLayout}>
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

            {isDeferredContentReady && (
                <>
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
                </>
            )}
            {currencyPicker.isVisible && (
                <CurrencyPickerBottomSheet
                    visible={currencyPicker.isVisible}
                    title={t('settings.selectedCurrency')}
                    onClose={currencyPicker.onClose}
                    items={currencyPicker.items}
                    selectedValue={currencyPicker.draft}
                    onConfirm={currencyPicker.onConfirm}
                />
            )}
            {isBirthdayModalVisible && (
                <DateTimePickerModal
                    visible={isBirthdayModalVisible}
                    mode="date"
                    title={t('registration.birthday')}
                    date={pickerDate}
                    onClose={onCloseBirthdayModal}
                    onConfirm={onConfirmBirthday}
                    onDateChange={onChangePickerDate}
                />
            )}
            {isDeleteAvatarAlertVisible && (
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
            )}
        </ScreenContainer>
    );
};
