import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { localization } from '@/UIProvider/localization/Localization';
import { registerUserModel } from '@/entities/users/RegisterUserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';

const MIN_AGE = 18;

export const usePersonalDetails = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [form, setForm] = useState({
        firstName: registerUserModel.user?.firstName || '',
        lastName: registerUserModel.user?.lastName || '',
        birthday: registerUserModel.user?.birthday || '',
        occupation: registerUserModel.user?.occupation || '',
        wineryName: registerUserModel.user?.wineryName || '',
        instagramLink: registerUserModel.user?.instagramLink || '',
        placeOfWork:  registerUserModel.user?.placeOfWork || '',
        gender: registerUserModel.user?.gender || '',
    });
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const isDisabled = useMemo(() => {
        const baseRequired = [form.firstName, form.lastName, form.birthday, form.gender];
        const hasEmptyBase = baseRequired.some(field => !field.trim());
        const level = registerUserModel.user?.wineExperienceLevel;
        const requiresOccupation =
            level === WineExperienceLevelEnum.EXPERT && !form.occupation.trim();
        const requiresWineryName =
            level === WineExperienceLevelEnum.CREATOR && !form.wineryName.trim();
        const expertRequires = 
            level !== WineExperienceLevelEnum.LOVER && !form.placeOfWork.trim() && !form.instagramLink.trim();

        return hasEmptyBase || requiresOccupation || requiresWineryName || expertRequires || isError.status;
    }, [form, isError]);

    const onChangeFirstName = useCallback((value: string) => {
        setForm(prev => ({ ...prev, firstName: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeLastName = useCallback((value: string) => {
        setForm(prev => ({ ...prev, lastName: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeBirthday = useCallback((value: string) => {
        setForm(prev => ({ ...prev, birthday: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeOccupation = useCallback((value: string) => {
        setForm(prev => ({ ...prev, occupation: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeWineryName = useCallback((value: string) => {
        setForm(prev => ({ ...prev, wineryName: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeInstagramLink =  useCallback((value: string) => {
        setForm(prev => ({ ...prev, instagramLink: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeGender =  useCallback((value: string) => {
        setForm(prev => ({ ...prev, gender: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangePlaceOfWork =  useCallback((value: string) => {
        setForm(prev => ({ ...prev, placeOfWork: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const handleNextPress = useCallback(async () => {
        if (!registerUserModel.user) return;

        const birthdayDate = new Date(form.birthday);
        const today = new Date();
        const age = today.getFullYear() - birthdayDate.getFullYear();
        const monthDiff = today.getMonth() - birthdayDate.getMonth();
        const dayDiff = today.getDate() - birthdayDate.getDate();
        const isUnderAllowed =
            age < MIN_AGE || (age === MIN_AGE && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

        if (isUnderAllowed) {
            return setIsError({ status: true, errorText: localization.t('registration.birthdayError') });
        }

        registerUserModel.user = {
            ...registerUserModel.user,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            birthday: form.birthday,
            gender: form.gender,
        }

        if (registerUserModel.user.wineExperienceLevel === WineExperienceLevelEnum.EXPERT) {
            registerUserModel.user = {
                ...registerUserModel.user,
                occupation: form.occupation.trim(),
                placeOfWork: form.placeOfWork.trim(),
                instagramLink: form.instagramLink.trim(),
            }
        }

        if (registerUserModel.user.wineExperienceLevel === WineExperienceLevelEnum.CREATOR) {
            registerUserModel.user = {
                ...registerUserModel.user,
                wineryName: form.wineryName.trim(),
                placeOfWork: form.placeOfWork.trim(),
                instagramLink: form.instagramLink.trim(),
            }
        }

        navigation.navigate('CreatePasswordView');
    }, [navigation, form]);

    return { 
        form, onChangeFirstName, onChangeLastName, onChangeBirthday, onChangeOccupation, handleNextPress, onChangeWineryName,
        isError, isDisabled, onChangeInstagramLink, onChangeGender, onChangePlaceOfWork
    };
};
