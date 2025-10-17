import { useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { CustomInput } from '@/UIKit/CustomInput';
import { useSignIn } from '@/modules/authentication/presenters/useSignIn';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { AppleIcon } from '@/assets/icons/AppleIcon';
import { GoogleIcon } from '@/assets/icons/GoogleIcon';
import { scaleVertical } from '@/utils';
import { SignUpFooter } from '@/modules/authentication/ui/components/SignUpFooter';
import { Warning } from '@/modules/authentication/ui/components/Warning';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';

export const SignInView = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { form, isError, disabled, onChangeEmail, onChangePassword, onAuthorize, forgotPasswordPress, isLoading, 
        retrySignIn } = useSignIn();

    return (
        <WithErrorHandler
            error={isError.status && isError.errorText === '' ? ErrorTypeEnum.ERROR : null}
            onRetry={retrySignIn}
        >
            <ScreenContainer edges={['top', 'bottom']} headerComponent={<HeaderWithBackButton />}>
                <View style={styles.container}>
                    <View>
                        <Typography text={t('authentication.signIn')} variant="h3" style={styles.title} />
                        <CustomInput
                            keyboardType="email-address"
                            value={form.email}
                            onChangeText={onChangeEmail}
                            autoCapitalize="none"
                            placeholder={t('authentication.email')}
                            error={isError.status}
                        />
                        <CustomInput
                            secureTextEntry
                            autoCapitalize="none"
                            value={form.password}
                            onChangeText={onChangePassword}
                            placeholder={t('authentication.password')}
                            error={isError.status}
                            containerStyle={styles.passwordInput}
                        />
                        {isError.status && <Warning warningText={isError.errorText} />}
                        <TouchableOpacity onPress={forgotPasswordPress} style={styles.forgotButton}>
                            <Typography
                                text={t('authentication.forgotPassword')}
                                variant="body_500"
                                style={styles.text}
                            />
                        </TouchableOpacity>
                        <Button
                            text={t('authentication.signIn')}
                            onPress={onAuthorize}
                            type="secondary"
                            disabled={disabled}
                            inProgress={isLoading}
                        />
                        <View style={styles.separator}>
                            <View style={styles.line} />
                            <Typography text={t('authentication.or')} variant="body_500" />
                            <View style={styles.line} />
                        </View>
                        <Button
                            text={t('authentication.continueWithGoogle')}
                            onPress={() => {}}
                            LeftAccessory={<GoogleIcon height={scaleVertical(24)} width={scaleVertical(24)} />}
                            RightAccessory={<View style={styles.empty} />}
                            containerStyle={styles.googleButton}
                            type="auth"
                        />
                        <Button
                            text={t('authentication.continueWithApple')}
                            onPress={() => {}}
                            LeftAccessory={<AppleIcon height={scaleVertical(24)} width={scaleVertical(24)} />}
                            RightAccessory={<View style={styles.empty} />}
                            type="auth"
                        />
                    </View>
                    <SignUpFooter />
                </View>
            </ScreenContainer>
        </WithErrorHandler>
    );
};
