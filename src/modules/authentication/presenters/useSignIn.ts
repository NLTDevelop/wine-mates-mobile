import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { toastService } from '@/libs/toast/toastService';
import { useValidator } from '@/hooks/useValidator';
import { userService } from '@/entities/users/UserService';
import { localization } from '@/UIProvider/localization/Localization';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { featuresService } from '@/entities/features/FeaturesService';

export const useSignIn = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { validateEmail, validatePassword } = useValidator();
    const [form, setForm] = useState({ email: '', password: '' });
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onChangeEmail = (value: string) => {
        setForm(prev => ({ ...prev, email: value || '' }));
        setIsError({ status: false, errorText: '' });
    };

    const onChangePassword = (value: string) => {
        if (value.includes(' ')) return;
        setForm(prev => ({ ...prev, password: value }));
        setIsError({ status: false, errorText: '' });
    };

    const onAuthorize = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await userService.signIn(form);
            if (response.isError) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError({ status: true, errorText: response.message });
                } else {
                    setIsError({ status: true, errorText: '' });
                }
            } else {
                featuresService.list();
                navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigation, form]);

    const forgotPasswordPress = useCallback(() => {
        navigation.navigate('ForgotPasswordView');
    }, [navigation]);

    const retrySignIn = useCallback(() => {
        setIsError({ status: false, errorText: '' });
        onAuthorize();
    }, [onAuthorize]);

    const disabled = !validateEmail(form.email).isValid || !validatePassword(form.password).isValid;

    return { 
        form, isError, disabled, onChangeEmail, onChangePassword, onAuthorize, forgotPasswordPress, isLoading, retrySignIn,
    };
};
