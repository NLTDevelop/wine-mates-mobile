import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '../../../../UIProvider';
import { ScreenContainer } from '../../../../UIKit/ScreenContainer';
import { Typography } from '../../../../UIKit/Typography';
import { Button } from '../../../../UIKit/Button';
import { CustomInput } from '../../../../UIKit/CustomInput';
import { HeaderWithBackButton } from '../../../../UIKit/HeaderWithBackButton';
import { SignUpFooter } from '../components/SignUpFooter';
import { useForgotPassword } from '../../presenters/useForgotPassword';
import { Warning } from '../components/Warning';

export const ForgotPasswordView = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { email, onChangeEmail, isLoading, handleSendPress, isError } = useForgotPassword();

    return (
        <ScreenContainer edges={['top', 'bottom']} headerComponent={<HeaderWithBackButton />}>
            <View style={styles.container}>
                <View>
                    <Typography text={t('authentication.resetYourPassword')} variant="h3" style={styles.title} />
                    <Typography
                        text={t('authentication.resetPasswordDescription')}
                        variant="body_400"
                        style={styles.text}
                    />
                    <CustomInput
                        keyboardType="email-address"
                        value={email}
                        onChangeText={onChangeEmail}
                        autoCapitalize="none"
                        placeholder={t('authentication.email')}
                        error={isError.status}
                        containerStyle={styles.input}
                    />
                    {isError.status && <Warning warningText={isError.errorText} />}
                </View>
                <View style={styles.footer}>
                    <Button
                        text={t('authentication.sendCode')}
                        onPress={handleSendPress}
                        type="secondary"
                        inProgress={isLoading}
                    />
                    <SignUpFooter />
                </View>
            </View>
        </ScreenContainer>
    );
};
