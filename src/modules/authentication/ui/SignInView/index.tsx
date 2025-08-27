import { useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '../../../../UIProvider';
import { ScreenContainer } from '../../../../UIKit/ScreenContainer';
import { Typography } from '../../../../UIKit/Typography';
import { Button } from '../../../../UIKit/Button';
import { CustomInput } from '../../../../UIKit/CustomInput';
import { useSignIn } from '../../presenters/useSignIn';
import { HeaderWithBackButton } from '../../../../UIKit/HeaderWithBackButton';
import { AppleIcon } from '../../../../assets/icons/AppleIcon';
import { GoogleIcon } from '../../../../assets/icons/GoogleIcon';
import { scaleVertical } from '../../../../utils';
import { ErrorIcon } from '../../../../assets/icons/ErrorIcon';
import { SignUpFooter } from '../components/SignUpFooter';

export const SignInView = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { form, error, disabled, onChangeEmail, onChangePassword, onAuthorize, forgotPasswordPress, isLoading } =
        useSignIn();

    return (
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
                        error={error}
                    />
                    <CustomInput
                        secureTextEntry
                        autoCapitalize="none"
                        value={form.password}
                        onChangeText={onChangePassword}
                        placeholder={t('authentication.password')}
                        error={error}
                        containerStyle={styles.passwordInput}
                    />
                    {error && (
                        <View style={styles.errorContainer}>
                            <ErrorIcon />
                            <Typography
                                text={t('authentication.somethingNotCorrect')}
                                variant="subtitle_12_400"
                                style={styles.errorText}
                            />
                        </View>
                    )}
                    <TouchableOpacity onPress={forgotPasswordPress} style={styles.forgotButton}>
                        <Typography text={t('authentication.forgotPassword')} variant="body_500" style={styles.text} />
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
    );
};
