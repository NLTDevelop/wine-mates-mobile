import { registerUserModel } from '@/entities/users/RegisterUserModel';
import { userService } from '@/entities/users/UserService';
import { useValidator } from '@/hooks/useValidator';
import { ICountry } from '@/libs/countryCodePicker/types/ICountry';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';

export const useRegistration = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { validateEmail } = useValidator();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countryCode, setCountryCode] = useState('+380');
    const [country, setCountry] = useState<ICountry | null>(null);
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const isDisabled = useMemo(() => {
        const hasPhone = phone.trim().length > 0;
        const hasEmail = email.trim().length > 0;
        const hasCountry = !!country;
        return !(hasPhone && hasEmail && hasCountry);
    }, [phone, email, country]);

    const onChangePhone = useCallback((text: string) => {
        setIsError({ status: false, errorText: '' });
        setPhone(text);
    }, []);

    const onChangeEmail = useCallback((text: string) => {
        setIsError({ status: false, errorText: '' });
        setEmail(text);
    }, []);

    const clearPhone = useCallback(() => {
        setPhone('');
    }, []);

    const onChangeCountryCode = useCallback((code: string) => {
        setCountryCode(code);
    }, []);

    const onChangeCountry = useCallback((code: ICountry) => {
        setCountry(code);
    }, []);

    const handleNext = useCallback(async () => {
        try {
            if (!registerUserModel.user) return;

            if (!validateEmail(email).isValid) {
                return setIsError({ status: true, errorText: localization.t('authentication.invalidEmail') });
            }
    
            setIsLoading(true);

            const payload = {
                email,
            };

            const response = await userService.validateEmail(payload);

            if (response.isError) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError({ status: true, errorText: response.message });
                } else {
                    setIsError({ status: true, errorText: '' });
                }
            } else {
                const fullPhone = `${countryCode}${phone}`;
    
                registerUserModel.user = {
                    ...registerUserModel.user,
                    phoneNumber: fullPhone,
                    email,
                    country: country?.cca2 || '',
                }
        
                navigation.navigate('PersonalDetailsView');
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigation, email, phone, countryCode, country, validateEmail]);

    const handleRetry = useCallback(() => {
        setIsError({ status: false, errorText: '' });
        handleNext();
    }, [handleNext]);

    return { 
        email, phone, isError, onChangeEmail, onChangePhone, clearPhone, handleNext, onChangeCountryCode, onChangeCountry, country,
        isDisabled, isLoading, handleRetry
    };
};
