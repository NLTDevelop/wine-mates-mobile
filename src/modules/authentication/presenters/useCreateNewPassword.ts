import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { userService } from '@/entities/users/UserService';
import { toastService } from '@/libs/toast/toastService';

export const useCreateNewPassword = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { email } = useRoute().params as { email: string };
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const [isLoading, setIsLoading] = useState(false);
    const isDisabled = useMemo(() => {
        const baseRequired = [form.password, form.confirmPassword];
        const hasEmptyBase = baseRequired.some(field => !field.trim());
        return hasEmptyBase || isError.status;
    }, [form, isError]);

    const onChangePassword = useCallback((value: string) => {
        setForm(prev => ({ ...prev, password: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeConfirmPassword = useCallback((value: string) => {
        setForm(prev => ({ ...prev, confirmPassword: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const handleSavePress = useCallback(async () => {
        try {
            if (form.password.length === 0) {
                return setIsError({ status: true, errorText: localization.t('authentication.newPasswordIsRequired') });
            }

            if (form.confirmPassword.length === 0) {
                return setIsError({
                    status: true,
                    errorText: localization.t('authentication.confirmNewPasswordIsRequired'),
                });
            }

            if (form.password !== form.confirmPassword) {
                return setIsError({ status: true, errorText: localization.t('authentication.confirmPasswordError') });
            }

            setIsLoading(true);

            const response = await userService.confirmPasswordReset({ email, newPassword: form.password });

            if (response.isError) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError({ status: true, errorText: response.message });
                } else {
                    setIsError({ status: true, errorText: '' });
                }
            } else {
                navigation.navigate('SignInView', undefined, { pop: true });
            }
        } finally {
            setIsLoading(false);
        }
    }, [email, form, navigation]);

    const handleRetry = useCallback(() => {
        setIsError({ status: false, errorText: '' });
        handleSavePress();
    }, [handleSavePress]);

    return { 
        form, onChangePassword, onChangeConfirmPassword, isLoading, handleSavePress, isError, handleRetry, isDisabled
    };
};
