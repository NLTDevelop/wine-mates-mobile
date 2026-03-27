import { useCallback, useMemo, useState } from 'react';
import { userModel } from '@/entities/users/UserModel';
import { userService } from '@/entities/users/UserService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import countries from 'world-countries';
import { format } from 'date-fns';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useFocusEffect } from '@react-navigation/native';

interface IProfileForm {
    fullName: string;
    email: string;
    phoneNumber: string;
    country: string;
    city: string;
    birthday: string;
    gender: string;
    occupation: string;
    placeOfWork: string;
    instagramLink: string;
    website: string;
    bio: string;
}

export const useProfileSettings = () => {
    const normalizeE164Phone = useCallback((raw: string) => {
        const trimmed = raw.trim().replace(/\s+/g, '');
        if (!trimmed) return '';

        const lastPlusIndex = trimmed.lastIndexOf('+');
        if (lastPlusIndex > 0) {
            const tail = trimmed.slice(lastPlusIndex + 1).replace(/[^\d]/g, '');
            return tail ? `+${tail}` : '';
        }

        if (trimmed.startsWith('+')) {
            const digits = trimmed.replace(/[^\d+]/g, '');
            return digits;
        }

        return trimmed.replace(/[^\d]/g, '');
    }, []);

    const getCallingCodeFromUser = useCallback(() => {
        if (!userModel.user?.phoneNumber) return '';
        const normalized = normalizeE164Phone(userModel.user.phoneNumber);
        const parsed = normalized ? parsePhoneNumberFromString(normalized) : null;
        return parsed?.countryCallingCode ? `+${parsed.countryCallingCode}` : '';
    }, [normalizeE164Phone]);

    const getInitialForm = useCallback((): IProfileForm => {
        const firstName = userModel.user?.firstName || '';
        const lastName = userModel.user?.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();

        const normalized = userModel.user?.phoneNumber ? normalizeE164Phone(userModel.user.phoneNumber) : '';
        const parsedPhone = normalized ? parsePhoneNumberFromString(normalized) : null;
        const fallbackCallingCodeDigits = (() => {
            const cca2 = userModel.user?.country;
            if (!cca2) return '';
            const matched = countries.find(c => c.cca2?.toLowerCase?.() === cca2.toLowerCase());
            const callingCode = `${matched?.idd?.root || ''}${matched?.idd?.suffixes?.[0] || ''}`; // e.g. +380
            return callingCode.replace('+', '');
        })();
        const normalizedDigits = normalized.startsWith('+') ? normalized.slice(1) : normalized;
        const derivedNational =
            parsedPhone?.nationalNumber ||
            (() => {
                const callingCodeDigits = parsedPhone?.countryCallingCode || fallbackCallingCodeDigits;
                if (callingCodeDigits && normalizedDigits.startsWith(callingCodeDigits)) {
                    return normalizedDigits.slice(callingCodeDigits.length);
                }
                return normalizedDigits;
            })();

        return {
            fullName,
            email: userModel.user?.email || '',
            phoneNumber: derivedNational || '',
            country: userModel.user?.country || parsedPhone?.country || '',
            city: userModel.user?.city || '',
            birthday: userModel.user?.birthday || '',
            gender: userModel.user?.gender || '',
            occupation: userModel.user?.occupation || '',
            placeOfWork: userModel.user?.wineryName || '',
            instagramLink: '',
            website: '',
            bio: userModel.user?.bio || '',
        };
    }, [normalizeE164Phone]);
    const [form, setForm] = useState<IProfileForm>(getInitialForm);
    const [isInProgress, setIsInProgress] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [countryCode, setCountryCode] = useState(getCallingCodeFromUser);
    const [expertiseLevel, setExpertiseLevel] = useState<WineExperienceLevelEnum>(
        userModel.user?.wineExperienceLevel || WineExperienceLevelEnum.LOVER
    );
    const selectExpertiseModalRef = useRef<BottomSheetModal | null>(null);
    const isCountryCodeInitializedRef = useRef(!!getCallingCodeFromUser());

    const countryOptions = useMemo<IDropdownItem[]>(() => {
        return countries
            .map(item => ({ label: item.name.common, value: item.cca2 }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    const genderOptions = useMemo<IDropdownItem[]>(() => ([
        { label: localization.t('registration.genderMale'), value: 'male' },
        { label: localization.t('registration.genderFemale'), value: 'female' },
    ]), []);

    const onChangeField = useCallback((key: keyof IProfileForm, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    }, []);

    const onToggleEdit = useCallback(() => {
        setIsEditing(prev => {
            if (prev) {
                setForm(getInitialForm());
                setExpertiseLevel(userModel.user?.wineExperienceLevel || WineExperienceLevelEnum.LOVER);
                const callingCode = getCallingCodeFromUser();
                setCountryCode(callingCode);
                isCountryCodeInitializedRef.current = !!callingCode;
            }
            return !prev;
        });
    }, [getInitialForm, getCallingCodeFromUser]);

    const onRefetchUser = useCallback(async () => {
        const response = await userService.me();
        if (!response.isError && !isEditing) {
            setForm(getInitialForm());
            setExpertiseLevel(userModel.user?.wineExperienceLevel || WineExperienceLevelEnum.LOVER);
            const callingCode = getCallingCodeFromUser();
            setCountryCode(callingCode);
            isCountryCodeInitializedRef.current = !!callingCode;
        }
    }, [getInitialForm, getCallingCodeFromUser, isEditing]);

    useFocusEffect(
        useCallback(() => {
            onRefetchUser();
        }, [onRefetchUser])
    );

    const onChangeCountryCode = useCallback((value: string) => {
        // PhoneInputField calls this once on mount with locale-detected code.
        // If we already have a calling code from saved E.164 number, ignore that first call.
        const callingCode = getCallingCodeFromUser();
        if (isCountryCodeInitializedRef.current && callingCode) {
            isCountryCodeInitializedRef.current = false;
            return;
        }
        isCountryCodeInitializedRef.current = false;
        setCountryCode(value);
    }, [getCallingCodeFromUser]);

    const onSave = useCallback(async () => {
        const fullName = form.fullName.trim();
        if (!fullName) {
            return;
        }

        const [firstName = '', ...rest] = fullName.split(' ');
        const lastName = rest.join(' ');

        try {
            setIsInProgress(true);

            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            const rawPhone = form.phoneNumber.trim();
            const phoneNumber = rawPhone.startsWith('+')
                ? rawPhone
                : `${countryCode}${rawPhone}`.replace(/\s+/g, '');
            formData.append('phoneNumber', phoneNumber);
            formData.append('country', form.country.trim());
            formData.append('city', form.city.trim());
            formData.append('birthday', form.birthday);
            formData.append('gender', form.gender);
            formData.append('wineExperienceLevel', expertiseLevel);
            formData.append('occupation', form.occupation.trim());
            formData.append('wineryName', form.placeOfWork.trim());
            formData.append('instagramLink', form.instagramLink.trim());
            formData.append('website', form.website.trim());
            formData.append('bio', form.bio.trim());

            const response = await userService.update(formData);

            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong')
                );
            } else {
                await userService.me();
                toastService.showSuccess(
                    localization.t('common.success'),
                    localization.t('settings.profileUpdated')
                );
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile: ', JSON.stringify(error, null, 4));
        } finally {
            setIsInProgress(false);
        }
    }, [form, expertiseLevel, countryCode]);

    const isDisabled = useMemo(() => {
        return !form.fullName.trim() || !form.email.trim() || isInProgress;
    }, [form, isInProgress]);

    const birthdayDisplayText = useMemo(() => {
        if (!form.birthday) {
            return '';
        }

        const selectedDate = new Date(form.birthday);
        if (Number.isNaN(selectedDate.getTime())) {
            return '';
        }

        return format(selectedDate, 'MMMM d, yyyy');
    }, [form.birthday]);

    return {
        form,
        avatarUrl: userModel.user?.avatarUrl || null,
        expertiseLevel,
        birthdayDisplayText,
        isEditing,
        genderOptions,
        countryOptions,
        onToggleEdit,
        onChangeField,
        onChangeCountryCode,
        selectExpertiseModalRef,
        onOpenExpertiseModal: () => selectExpertiseModalRef.current?.present(),
        onCloseExpertiseModal: () => selectExpertiseModalRef.current?.dismiss(),
        onSelectExpertise: (value: WineExperienceLevelEnum) => {
            setExpertiseLevel(value);
            selectExpertiseModalRef.current?.dismiss();
        },
        onSave,
        isDisabled,
        isInProgress,
    };
};
