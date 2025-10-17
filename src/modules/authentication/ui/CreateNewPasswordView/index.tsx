import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { CustomInput } from '@/UIKit/CustomInput';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { SignUpFooter } from '@/modules/authentication/ui/components/SignUpFooter';
import { Warning } from '@/modules/authentication/ui/components/Warning';
import { useCreateNewPassword } from '@/modules/authentication/presenters/useCreateNewPassword';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';

export const CreateNewPasswordView = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { form, onChangePassword, onChangeConfirmPassword, isLoading, handleSavePress, isError, handleRetry } = useCreateNewPassword();

    return (
        <WithErrorHandler
            error={isError.status && isError.errorText === '' ? ErrorTypeEnum.ERROR : null}
            onRetry={handleRetry}
        >
            <ScreenContainer edges={['top', 'bottom']} headerComponent={<HeaderWithBackButton />}>
                <View style={styles.container}>
                    <View>
                        <Typography text={t('authentication.createNewPassword')} variant="h3" style={styles.title} />
                        <Typography
                            text={t('authentication.newPasswordDescription')}
                            variant="body_400"
                            style={styles.text}
                        />
                        <CustomInput
                            secureTextEntry
                            autoCapitalize="none"
                            value={form.password}
                            onChangeText={onChangePassword}
                            placeholder={t('authentication.newPassword')}
                            error={isError.status}
                        />
                        <CustomInput
                            secureTextEntry
                            autoCapitalize="none"
                            value={form.confirmPassword}
                            onChangeText={onChangeConfirmPassword}
                            placeholder={t('authentication.confirmNewPassword')}
                            error={isError.status}
                            containerStyle={styles.input}
                        />
                        {isError.status && <Warning warningText={isError.errorText} />}
                    </View>
                    <View style={styles.footer}>
                        <Button
                            text={t('common.save')}
                            onPress={handleSavePress}
                            type="secondary"
                            inProgress={isLoading}
                        />
                        <SignUpFooter />
                    </View>
                </View>
            </ScreenContainer>
        </WithErrorHandler>
    );
};
