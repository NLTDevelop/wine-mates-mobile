import { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { SignInFooter } from '@/modules/registration/ui/components/SignInFooter';
import { Button } from '@/UIKit/Button';
import { CustomInput } from '@/UIKit/CustomInput';
import { usePersonalDetails } from '../../presenters/usePersonalDetails';
import { registerUserModel } from '@/entities/users/RegisterUserModel';
import { observer } from 'mobx-react';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { BirthdaySelector } from '../components/BirthdaySelector';
import DatePicker from 'react-native-date-picker';
import { useBirthdaySelector } from '../../presenters/useBirthdaySelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Warning } from '@/modules/authentication/ui/components/Warning';
import { getStyles } from './styles';

export const PersonalDetailsView = observer(() => {
    const { t, colors, locale, theme } = useUiContext();
    const { bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { form, onChangeFirstName, onChangeLastName, onChangeBirthday, onChangeOccupation, handleNextPress, onChangeWineryName,
        isError, isDisabled } = usePersonalDetails();

    const { handlePress, isOpened, pickerDate, setPickerDate } =
        useBirthdaySelector(onChangeBirthday);

    const bottomInset = useMemo(
        () => ({ paddingBottom: isOpened ? 0 : bottom }),
        [bottom, isOpened],
    );

    return (
        <ScreenContainer edges={['top']} headerComponent={<HeaderWithBackButton />} scrollEnabled>
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
                                onFocus={() => isOpened && handlePress()}
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
                            onFocus={() => isOpened && handlePress()}
                        />
                        <View>
                            <BirthdaySelector
                                date={form.birthday}
                                handlePress={handlePress}
                                isOpened={isOpened}
                                isError={isError.status}
                            />
                            {isError.status && <Warning warningText={isError.errorText} />}
                        </View>
                        {registerUserModel.user?.wineExperienceLevel === WineExperienceLevelEnum.EXPERT && (
                            <CustomInput
                                autoCapitalize="none"
                                value={form.occupation}
                                onChangeText={onChangeOccupation}
                                placeholder={t('registration.occupation')}
                                containerStyle={styles.input}
                                onFocus={() => isOpened && handlePress()}
                            />
                        )}
                        {registerUserModel.user?.wineExperienceLevel === WineExperienceLevelEnum.CREATOR && (
                            <CustomInput
                                autoCapitalize="none"
                                value={form.wineryName}
                                onChangeText={onChangeWineryName}
                                placeholder={t('registration.wineryName')}
                                containerStyle={styles.input}
                                onFocus={() => isOpened && handlePress()}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.footer}>
                    <Button
                        text={t('common.continue')}
                        onPress={handleNextPress}
                        type="secondary"
                        disabled={isDisabled}
                    />
                    <SignInFooter />
                </View>
            </View>
            {isOpened && (
                <>
                    <View style={styles.pickerWrapper}>
                        <DatePicker
                            locale={locale}
                            mode="date"
                            date={pickerDate}
                            onDateChange={setPickerDate}
                            theme={theme}
                        />
                    </View>
                    <Pressable style={styles.backdrop} onPress={handlePress} />
                </>
            )}
        </ScreenContainer>
    );
});
