import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
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
import { observer } from 'mobx-react';
import { Warning } from '@/modules/authentication/ui/components/Warning';

export const RegistrationView = observer(() => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { email, phone, isError, onChangeEmail, onChangePhone, clearPhone, handleNext, onChangeCountryCode,
        onChangeCountry, country, isDisabled } = useRegistration();

    return (
        <ScreenContainer edges={['top', 'bottom']} headerComponent={<HeaderWithBackButton />}>
            <View style={styles.container}>
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
                            {isError.status && <Warning warningText={isError.errorText} />}
                        </View>
                        <CountrySelector country={country} onChangeCountry={onChangeCountry} />
                    </View>
                </View>
                <View style={styles.footer}>
                    <Button text={t('common.continue')} onPress={handleNext} type="secondary" disabled={isDisabled} />
                    <SignInFooter />
                </View>
            </View>
        </ScreenContainer>
    );
});
