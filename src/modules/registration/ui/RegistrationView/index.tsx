import { useMemo } from 'react';
import { getStyles } from './styles';
import { Pressable, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { SignInFooter } from '@/modules/registration/ui/components/SignInFooter';
import { Button } from '@/UIKit/Button';
import { CustomInput } from '@/UIKit/CustomInput';
import { PhoneInputField } from '@/libs/countryCodePicker/components/PhoneInputField';
import { useRegistration } from '../../presenters/useRegistration';
import { CountrySelector } from '../../../../libs/countryCodePicker/components/CountrySelector';
import { registerUserModel } from '@/entities/users/RegisterUserModel';
import { observer } from 'mobx-react-lite';
import { Warning } from '@/modules/authentication/ui/components/Warning';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { BirthdaySelector } from '../components/BirthdaySelector';
import { useBirthdaySelector } from '../../presenters/useBirthdaySelector';
import DatePicker from 'react-native-date-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const RegistrationView = observer(() => {
    const { t, colors, locale, theme } = useUiContext();
    const { bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);
    const {
        email,
        phone,
        isError,
        onChangeEmail,
        onChangePhone,
        clearPhone,
        onNext,
        onChangeCountryCode,
        onChangeCountry,
        country,
        isDisabled,
        isLoading,
        onRetry,
        birthday,
        onChangeBirthday,
        maximumBirthdayDate,
    } = useRegistration();
    const {
        onPress: onBirthdayPress,
        isOpened,
        pickerDate,
        setPickerDate,
        scrollRef,
    } = useBirthdaySelector(onChangeBirthday);
    const isCreator = registerUserModel.user?.wineExperienceLevel === WineExperienceLevelEnum.CREATOR;
    const bottomInset = useMemo(() => ({ paddingBottom: isOpened ? 0 : bottom }), [bottom, isOpened]);

    return (
        <WithErrorHandler
            error={isError.status && isError.errorText === '' ? ErrorTypeEnum.ERROR : null}
            onRetry={onRetry}
        >
            <ScreenContainer
                edges={['top']}
                headerComponent={<HeaderWithBackButton />}
                isKeyboardAvoiding
                scrollEnabled
                scrollRef={scrollRef}
            >
                <View style={[styles.container, bottomInset]}>
                    <View style={styles.mainContainer}>
                        <Typography text={t('registration.getStarted')} variant="h3" style={styles.title} />
                        <Typography
                            text={t(`wineLevel.${registerUserModel.user?.wineExperienceLevel}`)}
                            variant="body_500"
                            style={styles.role}
                        />
                        <View style={styles.formContainer}>
                            <PhoneInputField
                                value={phone}
                                onChangeText={onChangePhone}
                                placeholder={t('registration.mobileNumber')}
                                clearPhone={clearPhone}
                                onChangeCountryCode={onChangeCountryCode}
                            />
                            <View>
                                <CustomInput
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={onChangeEmail}
                                    keyboardType="email-address"
                                    placeholder={t('registration.email')}
                                    containerStyle={styles.input}
                                    error={isError.status}
                                />
                                {!isCreator && isError.status && <Warning warningText={isError.errorText} />}
                            </View>
                            <CountrySelector country={country} onChangeCountry={onChangeCountry} />
                            {isCreator && (
                                <View>
                                    <BirthdaySelector
                                        date={birthday}
                                        onPress={onBirthdayPress}
                                        isOpened={isOpened}
                                        isError={false}
                                    />
                                    {isError.status && <Warning warningText={isError.errorText} />}
                                </View>
                            )}
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <Button
                            text={t('common.continue')}
                            onPress={onNext}
                            type="secondary"
                            disabled={isDisabled}
                            inProgress={isLoading}
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
                                maximumDate={maximumBirthdayDate}
                                theme={theme}
                            />
                        </View>
                        <Pressable style={styles.backdrop} onPress={onBirthdayPress} />
                    </>
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});
