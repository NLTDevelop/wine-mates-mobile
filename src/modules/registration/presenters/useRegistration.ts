import { registerUserModel } from '@/entities/users/RegisterUserModel';
import { userService } from '@/entities/users/UserService';
import { useValidator } from '@/hooks/useValidator';
import { ICountry } from '@/libs/countryCodePicker/types/ICountry';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';

const MIN_AGE = 18;

export const useRegistration = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { validateEmail } = useValidator();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countryCode, setCountryCode] = useState('+380');
    const [country, setCountry] = useState<ICountry | null>(null);
    const [birthday, setBirthday] = useState('');
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const maximumBirthdayDate = useMemo(() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - MIN_AGE);

        return date;
    }, []);
    const isDisabled = useMemo(() => {
        const hasPhone = phone.trim().length > 0;
        const hasEmail = email.trim().length > 0;
        const hasCountry = !!country;
        const isCreator = registerUserModel.user?.wineExperienceLevel === WineExperienceLevelEnum.CREATOR;

        return !(hasPhone && hasEmail && hasCountry) || (isCreator && !birthday);
    }, [phone, email, country, birthday]);

    const onChangePhone = useCallback((text: string) => {
        setIsError({ status: false, errorText: '' });
        setPhone(text);
    }, []);

    const onChangeEmail = useCallback((text: string) => {
        setIsError({ status: false, errorText: '' });
        setEmail(text.trim());
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

    const onChangeBirthday = useCallback((value: string) => {
        setBirthday(value);
        setIsError({ status: false, errorText: '' });
    }, []);

    const onNext = useCallback(async () => {
        try {
            if (!registerUserModel.user) return;

            if (!validateEmail(email).isValid) {
                return setIsError({ status: true, errorText: localization.t('authentication.invalidEmail') });
            }

            const isCreator = registerUserModel.user.wineExperienceLevel === WineExperienceLevelEnum.CREATOR;
            const birthdayDate = new Date(birthday);
            const today = new Date();
            const age = today.getFullYear() - birthdayDate.getFullYear();
            const monthDiff = today.getMonth() - birthdayDate.getMonth();
            const dayDiff = today.getDate() - birthdayDate.getDate();
            const isUnderAllowed =
                age < MIN_AGE || (age === MIN_AGE && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

            if (isCreator && isUnderAllowed) {
                return setIsError({ status: true, errorText: localization.t('registration.birthdayError') });
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
                    birthday: isCreator ? birthday : registerUserModel.user.birthday,
                };

                navigation.navigate(isCreator ? 'WineryDetailsView' : 'PersonalDetailsView');
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigation, email, phone, countryCode, country, birthday, validateEmail]);

    const onRetry = useCallback(() => {
        setIsError({ status: false, errorText: '' });
        onNext();
    }, [onNext]);

    return {
        email,
        phone,
        isError,
        onChangeEmail,
        onChangePhone,
        clearPhone,
        onNext,
        onChangeCountryCode,
        onChangeCountry,
        country,
        isDisabled,
        isLoading,
        onRetry,
        birthday,
        onChangeBirthday,
        maximumBirthdayDate,
    };
};
