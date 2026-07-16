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
import { BirthdaySelector } from '@/modules/registration/ui/components/BirthdaySelector';
import { DateTimePickerModal } from '@/UIKit/DateTimePickerModal';
import { InstagramIcon } from '@assets/icons/InstagramIcon';
import { SelectExpertiseBottomSheet } from './components/SelectExpertiseBottomSheet';
import { ExpertiseSelectorRow } from './components/ExpertiseSelectorRow';
import { SelectCityBottomSheet } from './components/SelectCityBottomSheet';
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { CurrencyPickerBottomSheet } from '@/UIKit/CurrencyPicker/ui';
import { ProfileSelectorRow } from './components/ProfileSelectorRow';
import { useKeyboardStickyLayout } from '@/hooks/useKeyboardStickyLayout';
import { Loader } from '@/UIKit/Loader';
import { ProfileGallery } from '@/modules/profile/ui/components/ProfileGallery';
import { ProfileFormField } from '@/modules/profile/ui/components/ProfileFormField';
import { PickerButton } from '@/UIKit/PickerButton';
import { UniversalPickerBottomModal } from '@/UIKit/UniversalPickerBottomModal';


export const EditProfileDetailsView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { scrollBottomOffset, extraKeyboardSpace, stickyOpenedOffset, onStickyLayout } = useKeyboardStickyLayout();

    const {
        form,
        phoneInitialCca2,
        avatarUrl,
        selectedAvatarUri,
        isMarkedForDeletion,
        onOpenCamera,
        onRemoveAvatar,
        expertiseLevel,
        birthdayDisplayText,
        countryPicker,
        genderPicker,
        cityOptions,
        citySearch,
        cityEmptyStateText,
        isCitySelectorDisabled,
        isCityLoading,
        onChangeFullName,
        onChangeEmail,
        onChangePhoneNumber,
        onChangeOccupation,
        currencyPicker,
        isCurrencySelectorDisabled,
        onChangePlaceOfWork,
        onChangeInstagramLink,
        onChangeWebsite,
        onChangeBio,
        cityModalRef,
        onOpenCitySelector,
        onCloseCitySelector,
        onDismissCitySelector,
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
        gallery,
        onAddGalleryPhoto,
        isDeleteGalleryPhotoAlertVisible,
        onCloseDeleteGalleryPhotoAlert,
        onConfirmDeleteGalleryPhoto,
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
                                size={120}
                                avatarUrl={avatarUrl}
                                fullname={form.fullName}
                                isEditing
                                selectedImageUri={selectedAvatarUri}
                                isMarkedForDeletion={isMarkedForDeletion}
                                onPress={onOpenCamera}
                                onRemove={onRemoveAvatar}
                            />
                        </View>

                        <ProfileGallery {...gallery} onAddPhoto={onAddGalleryPhoto} />

                        <ExpertiseSelectorRow expertiseLevel={expertiseLevel} onPress={onOpenExpertiseModal} />

                        <ProfileFormField label={t('settings.fullName')}>
                            <CustomInput
                                value={form.fullName}
                                onChangeText={onChangeFullName}
                                editable
                                placeholder={t('settings.fullName')}
                                containerStyle={styles.inputContainer}
                            />
                        </ProfileFormField>
                        <ProfileFormField label={t('settings.email')}>
                            <CustomInput
                                value={form.email}
                                onChangeText={onChangeEmail}
                                editable
                                placeholder={t('settings.email')}
                                containerStyle={styles.inputContainer}
                            />
                        </ProfileFormField>
                        <ProfileFormField label={t('settings.phoneNumber')}>
                            <PhoneInputField
                                value={form.phoneNumber}
                                onChangeText={onChangePhoneNumber}
                                onChangeCountryCode={onChangeCountryCode}
                                editable
                                initialCca2={phoneInitialCca2}
                            />
                        </ProfileFormField>
                        <ProfileFormField label={t('settings.country')}>
                            <PickerButton
                                text={countryPicker.selectedText}
                                placeholder={t('settings.country')}
                                onPress={countryPicker.onOpen}
                                isDisabled={countryPicker.isDisabled}
                            />
                        </ProfileFormField>
                        <ProfileFormField label={t('settings.city')}>
                            <ProfileSelectorRow
                                value={form.city}
                                placeholder={t('settings.city')}
                                disabled={isCitySelectorDisabled}
                                onPress={onOpenCitySelector}
                            />
                        </ProfileFormField>
                        <ProfileFormField label={t('registration.birthday')}>
                            <BirthdaySelector
                                date={form.birthday}
                                onPress={onOpenBirthdayModal}
                                isOpened={isBirthdayModalVisible}
                                isError={false}
                                displayText={birthdayDisplayText}
                                disabled={false}
                            />
                        </ProfileFormField>
                        <ProfileFormField label={t('settings.gender')}>
                            <PickerButton
                                text={genderPicker.selectedText}
                                placeholder={t('settings.gender')}
                                onPress={genderPicker.onOpen}
                                isDisabled={genderPicker.isDisabled}
                            />
                        </ProfileFormField>
                        <ProfileFormField label={t('settings.occupation')}>
                            <CustomInput
                                value={form.occupation}
                                onChangeText={onChangeOccupation}
                                editable
                                placeholder={t('settings.occupation')}
                                containerStyle={styles.inputContainer}
                            />
                        </ProfileFormField>
                        <ProfileFormField label={t('settings.selectedCurrency')}>
                            <ProfileSelectorRow
                                value={currencyPicker.selectedText}
                                placeholder={t('settings.selectedCurrency')}
                                disabled={isCurrencySelectorDisabled}
                                onPress={currencyPicker.onOpen}
                            />
                        </ProfileFormField>
                        <ProfileFormField label={t('settings.placeOfWork')}>
                            <CustomInput
                                value={form.placeOfWork}
                                onChangeText={onChangePlaceOfWork}
                                editable
                                placeholder={t('settings.placeOfWork')}
                                containerStyle={styles.inputContainer}
                            />
                        </ProfileFormField>
                        <ProfileFormField label={t('settings.instagramLabel')}>
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
                                containerStyle={styles.inputContainer}
                            />
                        </ProfileFormField>
                        <ProfileFormField label={t('settings.websiteLabel')}>
                            <CustomInput
                                value={form.website}
                                onChangeText={onChangeWebsite}
                                editable
                                placeholder={t('settings.website')}
                                containerStyle={styles.inputContainer}
                            />
                        </ProfileFormField>
                        <ProfileFormField label={t('settings.bio')}>
                            <CustomInput
                                value={form.bio}
                                onChangeText={onChangeBio}
                                editable
                                placeholder={t('settings.bio')}
                                multiline
                                inputContainerStyle={styles.bigInput}
                                containerStyle={styles.inputContainer}
                            />
                        </ProfileFormField>
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
                        onDismiss={onDismissCitySelector}
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
            {isDeleteGalleryPhotoAlertVisible && (
                <CustomAlert
                    visible={isDeleteGalleryPhotoAlertVisible}
                    onClose={onCloseDeleteGalleryPhotoAlert}
                    header={t('settings.deleteGalleryPhotoTitle')}
                    content={
                        <Typography
                            text={t('settings.deleteGalleryPhotoMessage')}
                            variant="body_400"
                            style={styles.alertMessage}
                        />
                    }
                    footer={
                        <View style={styles.alertFooter}>
                            <Button
                                text={t('settings.delete')}
                                onPress={onConfirmDeleteGalleryPhoto}
                                type="main"
                                containerStyle={styles.alertButton}
                            />
                            <Button
                                text={t('common.cancel')}
                                onPress={onCloseDeleteGalleryPhotoAlert}
                                type="secondary"
                                containerStyle={styles.alertButton}
                            />
                        </View>
                    }
                />
            )}
            {countryPicker.isVisible && (
                <UniversalPickerBottomModal
                    visible={countryPicker.isVisible}
                    title={countryPicker.title}
                    options={countryPicker.options}
                    isLoading={countryPicker.isLoading}
                    selectionMode="single"
                    emptyText={t('common.nothingFoundTitle')}
                    confirmText={t('common.confirm')}
                    onClose={countryPicker.onClose}
                    onConfirm={countryPicker.onConfirm}
                />
            )}
            {genderPicker.isVisible && (
                <UniversalPickerBottomModal
                    visible={genderPicker.isVisible}
                    title={genderPicker.title}
                    options={genderPicker.options}
                    isLoading={genderPicker.isLoading}
                    selectionMode="single"
                    emptyText={t('common.nothingFoundTitle')}
                    confirmText={t('common.confirm')}
                    onClose={genderPicker.onClose}
                    onConfirm={genderPicker.onConfirm}
                />
            )}
        </ScreenContainer>
    );
};
