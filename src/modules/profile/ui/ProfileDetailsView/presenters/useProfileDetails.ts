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

const getProfileField = (value: string | undefined | null, placeholder: string) => {
    const text = value || placeholder;

    return { text, isPlaceholder: !value };
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
    const expertiseLabel =
        expertiseLevel === WineExperienceLevelEnum.EXPERT
            ? localization.t('registration.wineExpert')
            : expertiseLevel === WineExperienceLevelEnum.CREATOR
              ? localization.t('registration.winemaker')
              : localization.t('registration.wineLover');
    const birthdayDisplayText = getBirthdayDisplayText(userModel.user?.birthday || '');
    const { phoneCca2, phoneNationalNumber } = getPhoneParts(userModel.user?.phoneNumber || '');
    const email = userModel.user?.email || '';
    const country = getCountryName(userModel.user?.country || '');
    const city = userModel.user?.city || '';
    const gender =
        userModel.user?.gender === 'male'
            ? localization.t('registration.genderMale')
            : userModel.user?.gender === 'female'
              ? localization.t('registration.genderFemale')
              : '';
    const occupation = userModel.user?.occupation || '';
    const placeOfWork = userModel.user?.wineryName || '';
    const instagramLink = userModel.user?.instagramLink || '';
    const website = userModel.user?.website || '';
    const bio = userModel.user?.bio || '';
    const selectedCurrency = userModel.user?.selectedCurrency || '';

    const fields = {
        fullName: getProfileField(fullName, localization.t('settings.fullName')),
        email: getProfileField(email, localization.t('settings.email')),
        country: getProfileField(country, localization.t('settings.country')),
        city: getProfileField(city, localization.t('settings.city')),
        birthday: getProfileField(birthdayDisplayText, localization.t('registration.birthday')),
        gender: getProfileField(gender, localization.t('settings.gender')),
        occupation: getProfileField(occupation, localization.t('settings.occupation')),
        placeOfWork: getProfileField(placeOfWork, localization.t('settings.placeOfWork')),
        selectedCurrency: getProfileField(selectedCurrency, localization.t('settings.selectedCurrency')),
        instagram: getProfileField(instagramLink, localization.t('settings.instagram')),
        website: getProfileField(website, localization.t('settings.website')),
        bio: getProfileField(bio, localization.t('settings.bio')),
    };

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
        phoneText: phoneNationalNumber || '',
        fields,
        onPressBack,
        onPressEdit,
        onPhoneChange,
        onCountryCodeChange,
    };
};
