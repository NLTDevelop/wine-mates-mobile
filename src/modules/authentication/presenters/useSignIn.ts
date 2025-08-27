import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import { toastService } from '../../../libs/toast/toastService';
import { useValidator } from '../../../hooks/useValidator';
import { userService } from '../../../entities/users/UserService';
import { localization } from '../../../UIProvider/localization/Localization';

export const useSignIn = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { validateEmail, validatePassword } = useValidator();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onChangeEmail = (value: string) => {
        setForm(prev => ({ ...prev, email: value?.toLowerCase() || '' }));
        setError(false);
    };

    const onChangePassword = (value: string) => {
        setForm(prev => ({ ...prev, password: value }));
        setError(false);
    };

    const onAuthorize = async () => {
        setIsLoading(true);
        const response = await userService.signIn(form);
        if (response.isError) {
            setError(true)
            toastService.showError(
                localization.t('common.errorHappened'),
                response.message || localization.t('common.somethingWentWrong'),
            );
        } else {
            navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
        }
        setIsLoading(false);
    };

    const forgotPasswordPress = useCallback(() => {
        navigation.navigate('ForgotPasswordView');
    }, [navigation]);

    const disabled = !validateEmail(form.email).isValid || !validatePassword(form.password).isValid;

    return { form, error, disabled, onChangeEmail, onChangePassword, onAuthorize, forgotPasswordPress, isLoading };
};
