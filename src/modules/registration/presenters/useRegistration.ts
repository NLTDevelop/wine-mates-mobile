import { registerUserModel } from '@/entities/users/RegisterUserModel';
import { useValidator } from '@/hooks/useValidator';
import { ICountry } from '@/libs/countryCodePicker/types/ICountry';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';

export const useRegistration = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { validateEmail } = useValidator();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
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

    const handleNext = useCallback(() => {
        if (!registerUserModel.user) return;

        if (!validateEmail(email).isValid) {
            return setIsError({ status: true, errorText: localization.t('authentication.invalidEmail') });
        }

        const fullPhone = `${countryCode}${phone}`;

        registerUserModel.user = {
            ...registerUserModel.user,
            phoneNumber: fullPhone,
            email,
            country: country?.cca2 || '',
        }

        navigation.navigate('PersonalDetailsView');
    }, [navigation, email, phone, countryCode, country, validateEmail]);

    return { 
        email, phone, isError, onChangeEmail, onChangePhone, clearPhone, handleNext, onChangeCountryCode, onChangeCountry, country,
        isDisabled
    };
};
