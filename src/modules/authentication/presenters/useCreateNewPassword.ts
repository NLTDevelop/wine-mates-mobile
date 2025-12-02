import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { userService } from '@/entities/users/UserService';
import { toastService } from '@/libs/toast/toastService';
import { userModel } from '@/entities/users/UserModel';
import { featuresService } from '@/entities/features/FeaturesService';
import { IUser } from '@/entities/users/types/IUser';

export const useCreateNewPassword = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { email, token, user } = useRoute().params as { email: string, token: string, user: IUser};
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const [isLoading, setIsLoading] = useState(false);
    const isDisabled = useMemo(() => {
        const baseRequired = [form.password, form.confirmPassword];
        const hasEmptyBase = baseRequired.some(field => !field.trim());
        return hasEmptyBase || isError.status;
    }, [form, isError]);

    const onChangePassword = useCallback((value: string) => {
        if (value.includes(' ')) return;
        setForm(prev => ({ ...prev, password: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeConfirmPassword = useCallback((value: string) => {
        if (value.includes(' ')) return;
        setForm(prev => ({ ...prev, confirmPassword: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const handleSavePress = useCallback(async () => {
        try {
            if (form.password.length === 0) {
                return setIsError({ status: true, errorText: localization.t('authentication.newPasswordIsRequired') });
            }

            if (form.password.length < 8) {
                return setIsError({ status: true, errorText: localization.t('authentication.passwordLengthError') });
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

            const response = await userService.confirmPasswordReset({ email, newPassword: form.password }, token);

            if (response.isError) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError({ status: true, errorText: response.message });
                } else {
                    setIsError({ status: true, errorText: '' });
                }
            } else {
                userModel.token = token;
                userModel.user = user;

                featuresService.list();
                navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
            }
        } finally {
            setIsLoading(false);
        }
    }, [email, form, navigation, token, user]);

    const handleRetry = useCallback(() => {
        setIsError({ status: false, errorText: '' });
        handleSavePress();
    }, [handleSavePress]);

    return { 
        form, onChangePassword, onChangeConfirmPassword, isLoading, handleSavePress, isError, handleRetry, isDisabled
    };
};
