import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { localization } from '../../../UIProvider/localization/Localization';

export const useCreateNewPassword = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const [isLoading, setIsLoading] = useState(false);

    const onChangePassword = (value: string) => {
        setForm(prev => ({ ...prev, password: value }));
        setIsError({ status: false, errorText: '' });
    };
    
    const onChangeConfirmPassword = (value: string) => {
        setForm(prev => ({ ...prev, confirmPassword: value?.toLowerCase() || '' }));
        setIsError({ status: false, errorText: '' });
    };

    const handleSavePress = () => {
        try {
            if (form.password.length === 0) {
                return setIsError({ status: true, errorText: localization.t('authentication.newPasswordIsRequired') });
            }

            if (form.confirmPassword.length === 0) {
                return setIsError({ status: true, errorText: localization.t('authentication.confirmNewPasswordIsRequired') });
            }

            if (form.password !== form.confirmPassword) {
                return setIsError({ status: true, errorText: localization.t('authentication.confirmPasswordError') });
            }

            setIsLoading(true);
            //TODO
            navigation.navigate('SignInView', undefined, { pop: true });
        } finally {
            setIsLoading(false);
        }
    };
123
    return { form, onChangePassword, onChangeConfirmPassword, isLoading, handleSavePress, isError };
};
