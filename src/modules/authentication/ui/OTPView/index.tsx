import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '../../../../UIProvider';
import { ScreenContainer } from '../../../../UIKit/ScreenContainer';
import { Typography } from '../../../../UIKit/Typography';
import { Button } from '../../../../UIKit/Button';
import { HeaderWithBackButton } from '../../../../UIKit/HeaderWithBackButton';
import { SignUpFooter } from '../components/SignUpFooter';
import { OTP } from '../components/OTP';
import { useOTP } from '../../presenters/useOTP';
import { Warning } from '../components/Warning';
import { TextButton } from '../components/TextButton';

export const OTPView = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { email, props, getCellOnLayoutHandler, ref, value, handleOTPValueChange, isError, isLoading, handleResetPress,
        CELL_COUNT, timer, isResendDisabled, handleResendCode } = useOTP();

    return (
        <ScreenContainer edges={['top', 'bottom']} headerComponent={<HeaderWithBackButton />}>
            <View style={styles.container}>
                <View>
                    <Typography text={t('authentication.resetYourPassword')} variant="h3" style={styles.title} />
                    <View style={styles.textContainer}>
                        <Typography variant="body_400" style={styles.descriptionText}>
                            {t('authentication.otpDescription')}
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
                            text={isResendDisabled ? `${t('authentication.resend')} (0:${timer})` : t('authentication.resend')}
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
                    />
                    <SignUpFooter />
                </View>
            </View>
        </ScreenContainer>
    );
};
