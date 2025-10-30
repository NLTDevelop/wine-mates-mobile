import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { CustomInput } from '@/UIKit/CustomInput';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Warning } from '@/modules/authentication/ui/components/Warning';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { useCreatePassword } from '../../presenters/useCreatePassword';
import { SignInFooter } from '../components/SignInFooter';
import { registerUserModel } from '@/entities/users/RegisterUserModel';

export const CreatePasswordView = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { form, onChangePassword, onChangeConfirmPassword, isLoading, handleSavePress, isError, handleRetry,
        isDisabled } = useCreatePassword();

    return (
        <WithErrorHandler
            error={isError.status && isError.errorText === '' ? ErrorTypeEnum.ERROR : null}
            onRetry={handleRetry}
        >
            <ScreenContainer edges={['top', 'bottom']} headerComponent={<HeaderWithBackButton />}>
                <View style={styles.container}>
                    <View>
                        <Typography text={t('authentication.password')} variant="h3" style={styles.title} />
                        <Typography
                            text={t(`wineLevel.${registerUserModel.user?.wineExperienceLevel}`)}
                            variant="body_500"
                            style={styles.role}
                        />
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
                            placeholder={t('registration.createPassword')}
                            error={isError.status}
                        />
                        <CustomInput
                            secureTextEntry
                            autoCapitalize="none"
                            value={form.confirmPassword}
                            onChangeText={onChangeConfirmPassword}
                            placeholder={t('registration.confirmPassword')}
                            error={isError.status}
                            containerStyle={styles.input}
                        />
                        {isError.status && <Warning warningText={isError.errorText} />}
                    </View>
                    <View style={styles.footer}>
                        <Button
                            text={t('authentication.signUp')}
                            onPress={handleSavePress}
                            type="secondary"
                            inProgress={isLoading}
                            disabled={isDisabled}
                        />
                        <SignInFooter />
                    </View>
                </View>
            </ScreenContainer>
        </WithErrorHandler>
    );
};
