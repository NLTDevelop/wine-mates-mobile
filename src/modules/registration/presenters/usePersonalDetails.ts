import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { localization } from '@/UIProvider/localization/Localization';
import { registerUserModel } from '@/entities/users/RegisterUserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { useRegistrationLinks } from '@/modules/registration/presenters/useRegistrationLinks';

const MIN_AGE = 18;

export const usePersonalDetails = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [form, setForm] = useState({
        firstName: registerUserModel.user?.firstName || '',
        lastName: registerUserModel.user?.lastName || '',
        birthday: registerUserModel.user?.birthday || '',
        occupation: registerUserModel.user?.occupation || '',
        placeOfWork: registerUserModel.user?.placeOfWork || '',
        gender: registerUserModel.user?.gender || '',
    });
    const initialLinks = registerUserModel.user?.links?.length
        ? registerUserModel.user.links
        : registerUserModel.user?.instagramLink
          ? [registerUserModel.user.instagramLink]
          : undefined;
    const { editableLinks, normalizedLinks, onAddLink } = useRegistrationLinks(initialLinks);
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const isDisabled = useMemo(() => {
        const baseRequired = [form.firstName, form.lastName, form.birthday, form.gender];
        const hasEmptyBase = baseRequired.some(field => !field.trim());
        const level = registerUserModel.user?.wineExperienceLevel;
        const requiresOccupation = level === WineExperienceLevelEnum.EXPERT && !form.occupation.trim();
        const expertRequires =
            level !== WineExperienceLevelEnum.LOVER && !form.placeOfWork.trim() && normalizedLinks.length === 0;

        return hasEmptyBase || requiresOccupation || expertRequires || isError.status;
    }, [form, isError, normalizedLinks.length]);

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

    const onChangeGender = useCallback((item: IDropdownItem) => {
        setForm(prev => ({ ...prev, gender: item.value?.toString() || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangePlaceOfWork = useCallback((value: string) => {
        setForm(prev => ({ ...prev, placeOfWork: value || '' }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onNextPress = useCallback(async () => {
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
            links: normalizedLinks,
        };

        if (registerUserModel.user.wineExperienceLevel === WineExperienceLevelEnum.EXPERT) {
            registerUserModel.user = {
                ...registerUserModel.user,
                occupation: form.occupation.trim(),
                placeOfWork: form.placeOfWork.trim(),
            };
        }

        navigation.navigate('CreatePasswordView');
    }, [navigation, form, normalizedLinks]);

    return {
        form,
        onChangeFirstName,
        onChangeLastName,
        onChangeBirthday,
        onChangeOccupation,
        onNextPress,
        isError,
        isDisabled,
        editableLinks,
        onAddLink,
        onChangeGender,
        onChangePlaceOfWork,
    };
};
