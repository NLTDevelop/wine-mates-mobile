import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { SignInFooter } from '@/modules/registration/ui/components/SignInFooter';
import { Button } from '@/UIKit/Button';
import { CustomInput } from '@/UIKit/CustomInput';
import { usePersonalDetails } from '../../presenters/usePersonalDetails';
import { registerUserModel } from '@/entities/users/RegisterUserModel';
import { observer } from 'mobx-react-lite';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { BirthdaySelector } from '../components/BirthdaySelector';
import { useBirthdaySelector } from '../../presenters/useBirthdaySelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Warning } from '@/modules/authentication/ui/components/Warning';
import { getStyles } from './styles';
import { CustomDropdown } from '@/UIKit/CustomDropdown/ui';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { DateTimePickerModal } from '@/UIKit/DateTimePickerModal';

export const PersonalDetailsView = observer(() => {
    const { t, colors } = useUiContext();
    const { bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const genderOptions = useMemo<IDropdownItem[]>(
        () => [
            { label: t('registration.genderMale'), value: 'male' },
            { label: t('registration.genderFemale'), value: 'female' },
        ],
        [t],
    );

    const {
        form,
        onChangeFirstName,
        onChangeLastName,
        onChangeBirthday,
        onChangeOccupation,
        onNextPress,
        isError,
        isDisabled,
        onChangeInstagramLink,
        onChangeGender,
        onChangePlaceOfWork,
    } = usePersonalDetails();
    const {
        onPress: onBirthdayPress,
        onClose: onCloseBirthdayModal,
        onConfirm: onConfirmBirthday,
        onInputFocus,
        onDateChange: onChangeBirthdayDate,
        isOpened,
        pickerDate,
        maximumBirthdayDate,
    } = useBirthdaySelector(form.birthday, onChangeBirthday);
    const bottomInset = useMemo(() => ({ paddingBottom: bottom }), [bottom]);

    return (
        <>
            <ScreenContainer
                edges={['top']}
                headerComponent={<HeaderWithBackButton />}
                scrollEnabled
                isKeyboardAvoiding
            >
                <View style={[styles.container, bottomInset]}>
                    <View style={styles.mainContainer}>
                        <Typography text={t('registration.personalDetails')} variant="h3" style={styles.title} />
                        <Typography
                            text={t(`wineLevel.${registerUserModel.user?.wineExperienceLevel}`)}
                            variant="body_500"
                            style={styles.role}
                        />
                        <View style={styles.formContainer}>
                            <View>
                                <CustomInput
                                    autoCapitalize="none"
                                    value={form.firstName}
                                    onChangeText={onChangeFirstName}
                                    placeholder={t('registration.firstName')}
                                    containerStyle={styles.input}
                                    onFocus={onInputFocus}
                                />
                                <Typography
                                    variant="subtitle_12_400"
                                    text={t('registration.firstNameExample')}
                                    style={styles.exampleText}
                                />
                            </View>
                            <CustomInput
                                autoCapitalize="none"
                                value={form.lastName}
                                onChangeText={onChangeLastName}
                                placeholder={t('registration.lastName')}
                                containerStyle={styles.input}
                                onFocus={onInputFocus}
                            />
                            <View>
                                <BirthdaySelector
                                    date={form.birthday}
                                    onPress={onBirthdayPress}
                                    isOpened={isOpened}
                                    isError={isError.status}
                                />
                                {isError.status && <Warning warningText={isError.errorText} />}
                            </View>
                            <CustomDropdown
                                data={genderOptions}
                                placeholder={t('registration.gender')}
                                onPress={onChangeGender}
                                selectedValue={form.gender}
                                containerStyle={styles.input}
                            />
                            {registerUserModel.user?.wineExperienceLevel === WineExperienceLevelEnum.EXPERT && (
                                <CustomInput
                                    autoCapitalize="none"
                                    value={form.occupation}
                                    onChangeText={onChangeOccupation}
                                    placeholder={t('registration.occupation')}
                                    containerStyle={styles.input}
                                    onFocus={onInputFocus}
                                />
                            )}
                            {registerUserModel.user?.wineExperienceLevel !== WineExperienceLevelEnum.LOVER && (
                                <CustomInput
                                    autoCapitalize="none"
                                    value={form.instagramLink}
                                    onChangeText={onChangeInstagramLink}
                                    placeholder={t('registration.instagramLink')}
                                    containerStyle={styles.input}
                                    onFocus={onInputFocus}
                                />
                            )}
                            {registerUserModel.user?.wineExperienceLevel !== WineExperienceLevelEnum.LOVER && (
                                <CustomInput
                                    autoCapitalize="none"
                                    value={form.placeOfWork}
                                    onChangeText={onChangePlaceOfWork}
                                    placeholder={t('registration.placeOfWork')}
                                    containerStyle={styles.input}
                                    onFocus={onInputFocus}
                                />
                            )}
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <Button
                            text={t('common.continue')}
                            onPress={onNextPress}
                            type="secondary"
                            disabled={isDisabled}
                        />
                        <SignInFooter />
                    </View>
                </View>
            </ScreenContainer>
            {isOpened && (
                <DateTimePickerModal
                    visible={isOpened}
                    mode="date"
                    title={t('registration.birthday')}
                    date={pickerDate}
                    maximumDate={maximumBirthdayDate}
                    onClose={onCloseBirthdayModal}
                    onConfirm={onConfirmBirthday}
                    onDateChange={onChangeBirthdayDate}
                />
            )}
        </>
    );
});
