import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { localization } from '../../../UIProvider/localization/Localization';
import { useValidator } from '../../../hooks/useValidator';

export const useForgotPassword = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { validateEmail } = useValidator();
    const [email, setEmail] = useState('');
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const [isLoading, setIsLoading] = useState(false);

    const onChangeEmail = (text: string) => {
        setIsError({ status: false, errorText: '' });
        setEmail(text);
    };

    const handleSendPress = () => {
        try {
            if (email.length === 0) {
                return setIsError({ status: true, errorText: localization.t('authentication.emailIsRequired') });
            }

            if (!validateEmail(email).isValid) {
                return setIsError({ status: true, errorText: localization.t('authentication.invalidEmail') });
            }

            setIsLoading(true);
            //TODO
            navigation.navigate('OTPView', { email });
        } finally {
            setIsLoading(false);
        }
    };

    return { email, onChangeEmail, isLoading, handleSendPress, isError };
};
