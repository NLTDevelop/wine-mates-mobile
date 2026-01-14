import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { localization } from '@/UIProvider/localization/Localization';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useOTPTimer } from '@/modules/authentication/presenters/useOTPTimer';
import { toastService } from '@/libs/toast/toastService';
import { userService } from '@/entities/users/UserService';

const CELL_COUNT = 4;

export const useOTP = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { remaining, isActive, start: startTimer } = useOTPTimer();
    const { email, isFromSettings } = useRoute().params as { email: string, isFromSettings: boolean };
    const [value, setValue] = useState('');
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const isResendDisabled = useMemo(() => isActive || isResending, [isActive, isResending]);
    const isResetDisabled = useMemo(() => value.length < 4 || isError.status, [value, isError.status]);

    const handleOTPValueChange = (otp: string) => {
        setIsError({ status: false, errorText: '' });
        setValue(otp);
    };

    const handleResetPress = useCallback(async () => {
        try {
            if (value.length < CELL_COUNT) {
                setIsError({ status: true, errorText: localization.t('authentication.incompleteCode') });
                return;
            }

            setIsLoading(true);
            const response = await userService.verifyResetCode({ email, code: value });

            if (response.isError) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError({ status: true, errorText: response.message });
                } else {
                    setIsError({ status: true, errorText: ''});
                }
            } else {
                navigation.replace('CreateNewPasswordView', { email, token: response.data?.accessToken, user: response.data?.user, isFromSettings });
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigation, value, email, isFromSettings]);

    const handleResendCode = useCallback(async () => {
        try {
            setIsResending(true);

            const response = await userService.resetPasswordRequest({ email });

            if (response.isError) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                } else {
                    setIsError({ status: true, errorText: ''});
                }
            } else {
                startTimer();
            }
        } finally {
            setIsResending(false);
        }
    }, [startTimer, email]);

    const handleRetry = useCallback(() => {
        setIsError({ status: false, errorText: '' });
    }, []);

    return { 
        email, props, getCellOnLayoutHandler, ref, value, handleOTPValueChange, isError, isLoading, handleResetPress, 
        CELL_COUNT, timer: remaining, isResendDisabled, handleResendCode, handleRetry, isResetDisabled, isFromSettings
    };
};
