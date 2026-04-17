import { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import countries from 'world-countries';
import { userService } from '@/entities/users/UserService';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { localization } from '@/UIProvider/localization/Localization';

const getCountryName = (cca2: string) => {
    if (!cca2) {
        return '';
    }

    const country = countries.find(item => item.cca2?.toLowerCase() === cca2.toLowerCase());
    if (!country) {
        return '';
    }

    try {
        const formatter = new Intl.DisplayNames([localization.locale || 'en'], { type: 'region' });
        const localized = formatter.of(country.cca2);
        if (localized) {
            return localized;
        }
    } catch {
        // fallback below
    }

    if ((localization.locale || '').startsWith('uk')) {
        return country.name?.native?.ukr?.common || country.name?.common || '';
    }

    return country.name?.common || '';
};

const getBirthdayDisplayText = (birthday: string) => {
    if (!birthday) {
        return '';
    }

    const date = new Date(birthday);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    try {
        return new Intl.DateTimeFormat(localization.locale || 'en', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    } catch {
        return format(date, 'MMMM d, yyyy');
    }
};

const getPhoneParts = (phoneNumber: string) => {
    const parsed = parsePhoneNumberFromString(phoneNumber);
    if (!parsed) {
        return {
            phoneCca2: null as string | null,
            phoneCountryCode: '',
            phoneNationalNumber: phoneNumber,
        };
    }

    return {
        phoneCca2: parsed.country ? parsed.country.toLowerCase() : null,
        phoneCountryCode: `+${parsed.countryCallingCode}`,
        phoneNationalNumber: parsed.nationalNumber || '',
    };
};

export const useProfileDetails = () => {
    const navigation = useNavigation<any>();

    useFocusEffect(
        useCallback(() => {
            const onLoadUser = async () => {
                await userService.me();
            };

            onLoadUser();
        }, []),
    );

    const fullName = `${userModel.user?.firstName || ''} ${userModel.user?.lastName || ''}`.trim();
    const expertiseLevel = userModel.user?.wineExperienceLevel || WineExperienceLevelEnum.LOVER;
    const expertiseLabel = expertiseLevel === WineExperienceLevelEnum.EXPERT
        ? localization.t('registration.wineExpert')
        : expertiseLevel === WineExperienceLevelEnum.CREATOR
            ? localization.t('registration.winemaker')
            : localization.t('registration.wineLover');
    const birthdayDisplayText = getBirthdayDisplayText(userModel.user?.birthday || '');
    const { phoneCca2, phoneNationalNumber } = getPhoneParts(userModel.user?.phoneNumber || '');

    const onPressBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onPressEdit = useCallback(() => {
        navigation.navigate('EditProfileDetailsView');
    }, [navigation]);

    const onPhoneChange = useCallback((_value: string) => {
        return;
    }, []);

    const onCountryCodeChange = useCallback((_value: string) => {
        return;
    }, []);

    return {
        avatarUrl: userModel.user?.avatarUrl || null,
        fullName,
        expertiseLevel,
        expertiseLabel,
        phoneCca2,
        phoneNationalNumber,
        email: userModel.user?.email || '',
        country: getCountryName(userModel.user?.country || ''),
        city: userModel.user?.city || '',
        birthdayDisplayText,
        gender: userModel.user?.gender === 'male'
            ? localization.t('registration.genderMale')
            : userModel.user?.gender === 'female'
                ? localization.t('registration.genderFemale')
                : '',
        occupation: userModel.user?.occupation || '',
        placeOfWork: userModel.user?.wineryName || '',
        instagramLink: userModel.user?.instagramLink || '',
        website: userModel.user?.website || '',
        bio: userModel.user?.bio || '',
        onPressBack,
        onPressEdit,
        onPhoneChange,
        onCountryCodeChange,
    };
};
