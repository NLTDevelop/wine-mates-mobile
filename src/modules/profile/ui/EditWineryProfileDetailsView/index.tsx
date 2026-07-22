import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { AvatarPicker } from '@/UIKit/AvatarPicker/ui';
import { Typography } from '@/UIKit/Typography';
import { CustomInput } from '@/UIKit/CustomInput';
import { Button } from '@/UIKit/Button';
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { Gallery } from '@/UIKit/Gallery';
import { useEditWineryProfileDetails } from './presenters/useEditWineryProfileDetails';
import { getStyles } from './styles';
import { PhoneInputField } from '@/libs/countryCodePicker/components/PhoneInputField';
import { BirthdaySelector } from '@/modules/registration/ui/components/BirthdaySelector';
import { DateTimePickerModal } from '@/UIKit/DateTimePickerModal';
import { EditableWineryLinks } from './components/EditableWineryLinks';
import { ProfileFormField } from '@/modules/profile/ui/components/ProfileFormField';
import { PickerButton } from '@/UIKit/PickerButton';
import { UniversalPickerBottomModal } from '@/UIKit/UniversalPickerBottomModal';

export const EditWineryProfileDetailsView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        form,
        userForm,
        wineryCountryPicker,
        regionPicker,
        userCountryPicker,
        phoneInitialCca2,
        birthdayDisplayText,
        mainPhotoUrl,
        selectedMainPhotoUri,
        removeMainPhoto,
        gallery,
        editableLinks,
        onChangeName,
        onChangeFoundedYear,
        onChangeDescription,
        onAddLink,
        onChangePhoneNumber,
        onChangeCountryCode,
        isBirthdayModalVisible,
        pickerDate,
        maximumBirthdayDate,
        onOpenBirthdayModal,
        onCloseBirthdayModal,
        onChangePickerDate,
        onConfirmBirthday,
        onPickMainPhoto,
        onRequestDeleteMainPhoto,
        isDeleteMainPhotoAlertVisible,
        onCloseDeleteMainPhotoAlert,
        onConfirmDeleteMainPhoto,
        onAddGalleryPhoto,
        isDeleteGalleryPhotoAlertVisible,
        onCloseDeleteGalleryPhotoAlert,
        onConfirmDeleteGalleryPhoto,
        isDisabled,
        isLoading,
        onSave,
        onPressBack,
    } = useEditWineryProfileDetails();

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            scrollEnabled
            isKeyboardAvoiding
            headerComponent={<HeaderWithBackButton title={t('settings.profileSettings')} onPressBack={onPressBack} />}
        >
            <View style={styles.container}>
                <View style={styles.mainPhotoSection}>
                    <Typography text={t('settings.mainPhoto')} variant="body_500" style={styles.mainPhotoTitle} />
                    <AvatarPicker
                        size={96}
                        avatarUrl={mainPhotoUrl}
                        fullname={form.name}
                        isEditing
                        selectedImageUri={selectedMainPhotoUri}
                        isMarkedForDeletion={removeMainPhoto}
                        onPress={onPickMainPhoto}
                        onRemove={onRequestDeleteMainPhoto}
                    />
                </View>
                <Gallery title={t('settings.photoGallery')} {...gallery} onAddPhoto={onAddGalleryPhoto} />
                <ProfileFormField label={t('registration.wineryName')}>
                    <CustomInput
                        value={form.name}
                        onChangeText={onChangeName}
                        placeholder={t('registration.wineryName')}
                        containerStyle={styles.inputContainer}
                        editable={false}
                    />
                </ProfileFormField>
                <ProfileFormField label={t('registration.foundedYear')}>
                    <CustomInput
                        value={form.foundedYear}
                        onChangeText={onChangeFoundedYear}
                        placeholder={t('registration.foundedYear')}
                        keyboardType="number-pad"
                        containerStyle={styles.inputContainer}
                    />
                </ProfileFormField>
                <ProfileFormField label={t('registration.wineryDescription')}>
                    <CustomInput
                        value={form.description}
                        onChangeText={onChangeDescription}
                        placeholder={t('registration.wineryDescription')}
                        multiline
                        inputContainerStyle={styles.descriptionInput}
                        containerStyle={styles.inputContainer}
                    />
                </ProfileFormField>
                <ProfileFormField label={t('settings.wineryCountry')}>
                    <PickerButton
                        text={wineryCountryPicker.selectedText}
                        placeholder={t('settings.wineryCountry')}
                        onPress={wineryCountryPicker.onOpen}
                        isDisabled={wineryCountryPicker.isDisabled}
                    />
                </ProfileFormField>
                <ProfileFormField label={t('registration.region')}>
                    <PickerButton
                        text={regionPicker.selectedText}
                        placeholder={t('registration.region')}
                        onPress={regionPicker.onOpen}
                        isDisabled={regionPicker.isDisabled}
                    />
                </ProfileFormField>
                <EditableWineryLinks items={editableLinks} onAdd={onAddLink} />
                <ProfileFormField label={t('settings.userCountry')}>
                    <PickerButton
                        text={userCountryPicker.selectedText}
                        placeholder={t('settings.userCountry')}
                        onPress={userCountryPicker.onOpen}
                        isDisabled={userCountryPicker.isDisabled}
                    />
                </ProfileFormField>
                <ProfileFormField label={t('settings.phoneNumber')}>
                    <PhoneInputField
                        value={userForm.phoneNumber}
                        onChangeText={onChangePhoneNumber}
                        onChangeCountryCode={onChangeCountryCode}
                        initialCca2={phoneInitialCca2}
                        placeholder={t('settings.phoneNumber')}
                    />
                </ProfileFormField>
                <ProfileFormField label={t('registration.birthday')}>
                    <BirthdaySelector
                        date={userForm.birthday}
                        onPress={onOpenBirthdayModal}
                        isOpened={isBirthdayModalVisible}
                        isError={false}
                        displayText={birthdayDisplayText}
                    />
                </ProfileFormField>
                <Button
                    text={t('common.save')}
                    onPress={onSave}
                    disabled={isDisabled}
                    inProgress={isLoading}
                    containerStyle={styles.button}
                />
            </View>
            <CustomAlert
                visible={isDeleteMainPhotoAlertVisible}
                onClose={onCloseDeleteMainPhotoAlert}
                header={t('settings.deleteMainPhotoTitle')}
                content={
                    <Typography
                        text={t('settings.deleteMainPhotoMessage')}
                        variant="subtitle_12_400"
                        style={styles.alertMessage}
                    />
                }
                footer={
                    <View style={styles.alertFooter}>
                        <Button
                            text={t('settings.delete')}
                            onPress={onConfirmDeleteMainPhoto}
                            containerStyle={styles.alertButton}
                        />
                        <Button
                            text={t('common.cancel')}
                            onPress={onCloseDeleteMainPhotoAlert}
                            type="secondary"
                            containerStyle={styles.alertButton}
                        />
                    </View>
                }
            />
            <CustomAlert
                visible={isDeleteGalleryPhotoAlertVisible}
                onClose={onCloseDeleteGalleryPhotoAlert}
                header={t('settings.deleteGalleryPhotoTitle')}
                content={
                    <Typography
                        text={t('settings.deleteGalleryPhotoMessage')}
                        variant="subtitle_12_400"
                        style={styles.alertMessage}
                    />
                }
                footer={
                    <View style={styles.alertFooter}>
                        <Button
                            text={t('settings.delete')}
                            onPress={onConfirmDeleteGalleryPhoto}
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
            <DateTimePickerModal
                visible={isBirthdayModalVisible}
                mode="date"
                title={t('registration.birthday')}
                date={pickerDate}
                maximumDate={maximumBirthdayDate}
                onClose={onCloseBirthdayModal}
                onConfirm={onConfirmBirthday}
                onDateChange={onChangePickerDate}
            />
            {wineryCountryPicker.isVisible && (
                <UniversalPickerBottomModal
                    visible={wineryCountryPicker.isVisible}
                    title={wineryCountryPicker.title}
                    options={wineryCountryPicker.options}
                    isLoading={wineryCountryPicker.isLoading}
                    selectionMode="single"
                    emptyText={t('common.nothingFoundTitle')}
                    confirmText={t('common.confirm')}
                    onClose={wineryCountryPicker.onClose}
                    onConfirm={wineryCountryPicker.onConfirm}
                />
            )}
            {regionPicker.isVisible && (
                <UniversalPickerBottomModal
                    visible={regionPicker.isVisible}
                    title={regionPicker.title}
                    options={regionPicker.options}
                    isLoading={regionPicker.isLoading}
                    selectionMode="single"
                    emptyText={t('wine.withoutRegion')}
                    confirmText={t('common.confirm')}
                    onClose={regionPicker.onClose}
                    onConfirm={regionPicker.onConfirm}
                />
            )}
            {userCountryPicker.isVisible && (
                <UniversalPickerBottomModal
                    visible={userCountryPicker.isVisible}
                    title={userCountryPicker.title}
                    options={userCountryPicker.options}
                    isLoading={userCountryPicker.isLoading}
                    selectionMode="single"
                    emptyText={t('common.nothingFoundTitle')}
                    confirmText={t('common.confirm')}
                    onClose={userCountryPicker.onClose}
                    onConfirm={userCountryPicker.onConfirm}
                />
            )}
        </ScreenContainer>
    );
};
