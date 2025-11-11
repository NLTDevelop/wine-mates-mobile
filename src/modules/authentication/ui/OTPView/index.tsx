import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { SignUpFooter } from '@/modules/authentication/ui/components/SignUpFooter';
import { OTP } from '@/modules/authentication/ui/components/OTP';
import { useOTP } from '@/modules/authentication/presenters/useOTP';
import { Warning } from '@/modules/authentication/ui/components/Warning';
import { TextButton } from '@/modules/authentication/ui/components/TextButton';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';

export const OTPView = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { email, props, getCellOnLayoutHandler, ref, value, handleOTPValueChange, isError, isLoading, handleResetPress,
        CELL_COUNT, timer, isResendDisabled, handleResendCode, handleRetry, isResetDisabled } = useOTP();
    const formattedTimerValue = timer.toString().padStart(2, '0');

    return (
        <WithErrorHandler error={isError.status && isError.errorText === '' ? ErrorTypeEnum.ERROR : null} onRetry={handleRetry}>
            <ScreenContainer edges={['top', 'bottom']} headerComponent={<HeaderWithBackButton />} isKeyboardAvoiding scrollEnabled>
                <View style={styles.container}>
                    <View>
                        <Typography text={t('authentication.enterConfirmationCode')} variant="h3" style={styles.title} />
                        <View style={styles.textContainer}>
                            <Typography variant="body_400" style={styles.descriptionText}>
                                {`${t('authentication.otpDescription')} `}
                                <Typography text={email} variant="body_400" />
                            </Typography>
                        </View>
                        <View style={styles.otpContainer}>
                            <OTP
                                value={value}
                                setValue={handleOTPValueChange as React.Dispatch<React.SetStateAction<string>>}
                                ref={ref}
                                props={props}
                                getCellOnLayoutHandler={getCellOnLayoutHandler}
                                cellCount={CELL_COUNT}
                                isError={isError.status}
                            />
                        </View>
                        {isError.status && <Warning warningText={isError.errorText} />}
                        <View style={styles.resendContainer}>
                            <Typography text={t('authentication.receiveCode')} variant="body_400" style={styles.text} />
                            <TextButton
                                text={
                                    isResendDisabled
                                        ? `${t('authentication.resend')} (0:${formattedTimerValue})`
                                        : t('authentication.resend')
                                }
                                onPress={handleResendCode}
                                textStyles={isResendDisabled ? styles.textButtonDisabled : styles.textButtonText}
                                disabled={isResendDisabled}
                            />
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <Button
                            text={t('authentication.resetPassword')}
                            onPress={handleResetPress}
                            type="secondary"
                            inProgress={isLoading}
                            disabled={isResetDisabled}
                        />
                        <SignUpFooter />
                    </View>
                </View>
            </ScreenContainer>
        </WithErrorHandler>
    );
};
