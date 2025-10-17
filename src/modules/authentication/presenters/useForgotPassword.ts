import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { useValidator } from '@/hooks/useValidator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useOTPTimer } from '@/modules/authentication/presenters/useOTPTimer';
import { userService } from '@/entities/users/UserService';
import { toastService } from '@/libs/toast/toastService';

export const useForgotPassword = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { validateEmail } = useValidator();
    const [email, setEmail] = useState('');
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { isActive, start: startTimer } = useOTPTimer();

    const onChangeEmail = (text: string) => {
        setIsError({ status: false, errorText: '' });
        setEmail(text);
    };

    const handleSendPress = useCallback(async () => {
        try {
            if (isActive) return;

            if (email.length === 0) {
                return setIsError({ status: true, errorText: localization.t('authentication.emailIsRequired') });
            }

            if (!validateEmail(email).isValid) {
                return setIsError({ status: true, errorText: localization.t('authentication.invalidEmail') });
            }

            setIsLoading(true);

            const response = await userService.resetPasswordRequest({ email });

            if (response.isError) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError({ status: true, errorText: response.message });
                } else {
                    setIsError({ status: true, errorText: ''});
                }
            } else {
                startTimer();
                navigation.navigate('OTPView', { email });
            }
        } finally {
            setIsLoading(false);
        }
    }, [email, isActive, navigation, startTimer, validateEmail]);

    const handleRetry = useCallback(() => {
        setIsError({ status: false, errorText: '' });
        handleSendPress();
    }, [handleSendPress]);

    return { email, onChangeEmail, isLoading, handleSendPress, isError, isSendDisabled: isActive, handleRetry };
};
