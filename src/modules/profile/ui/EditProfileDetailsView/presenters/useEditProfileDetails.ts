import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { userModel } from '@/entities/users/UserModel';
import { userService } from '@/entities/users/UserService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import countries from 'world-countries';
import { format } from 'date-fns';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { useLocation } from '@/libs/locations/presenters/useLocation';
import { useAvatarPicker } from '@/UIKit/AvatarPicker/presenters/useAvatarPicker';
import { useUiContext } from '@/UIProvider';
import { countryDisplayNames } from '@/libs/countryCodePicker/countryDisplayNames';
import { Keyboard } from 'react-native';

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

const getInitialCountryCode = (countryValue?: string) => {
    const rawValue = (countryValue || '').trim();
    if (!rawValue) {
        return '';
    }

    const maybeCode = rawValue.toUpperCase();
    const foundByCode = countries.find(item => item.cca2 === maybeCode);
    if (foundByCode) {
        return foundByCode.cca2;
    }

    const normalizedRaw = rawValue.toLocaleLowerCase();
    const foundByName = countries.find(item => {
        const commonName = (item.name?.common || '').toLocaleLowerCase();
        const officialName = (item.name?.official || '').toLocaleLowerCase();
        const nativeNames = Object.values(item.name?.native || {})
            .flatMap((nativeItem: any) => [nativeItem?.common || '', nativeItem?.official || ''])
            .map(name => String(name).toLocaleLowerCase());
        const translationNames = Object.values(item.translations || {})
            .flatMap((translation: any) => [translation?.common || '', translation?.official || ''])
            .map(name => String(name).toLocaleLowerCase());

        if (commonName === normalizedRaw || officialName === normalizedRaw) {
            return true;
        }

        if (nativeNames.includes(normalizedRaw) || translationNames.includes(normalizedRaw)) {
            return true;
        }

        return false;
    });

    return foundByName?.cca2 || '';
};

export const useEditProfileDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { locale } = useUiContext();
    const {
        citySuggestions,
        isCityLoading,
        searchCities,
        onCountryChanged,
        onSelectCity,
        clearCitySuggestions,
    } = useLocation();
    const { onOpenCamera } = useAvatarPicker();
    const [selectedAvatarImage, setSelectedAvatarImage] = useState<{ uri: string; name: string; type: string } | null>(null);
    const [isAvatarChanged, setIsAvatarChanged] = useState(false);
    const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);
    const [instagramLinkError, setInstagramLinkError] = useState<string | null>(null);
    const [isDeleteAvatarAlertVisible, setIsDeleteAvatarAlertVisible] = useState(false);

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

    const getPhoneCca2FromUser = useCallback(() => {
        if (!userModel.user?.phoneNumber) return null;
        const normalized = normalizeE164Phone(userModel.user.phoneNumber);
        const parsed = normalized ? parsePhoneNumberFromString(normalized) : null;
        return parsed?.country || null;
    }, [normalizeE164Phone]);

    const getInitialForm = useCallback((): IProfileForm => {
        const firstName = userModel.user?.firstName || '';
        const lastName = userModel.user?.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();

        const normalized = userModel.user?.phoneNumber ? normalizeE164Phone(userModel.user.phoneNumber) : '';
        const parsedPhone = normalized ? parsePhoneNumberFromString(normalized) : null;
        const normalizedDigits = normalized.startsWith('+') ? normalized.slice(1) : normalized;
        const derivedNational =
            parsedPhone?.nationalNumber ||
            (() => {
                const callingCodeDigits = parsedPhone?.countryCallingCode || '';
                if (callingCodeDigits && normalizedDigits.startsWith(callingCodeDigits)) {
                    return normalizedDigits.slice(callingCodeDigits.length);
                }
                return normalizedDigits;
            })();

        return {
            fullName,
            email: userModel.user?.email || '',
            phoneNumber: derivedNational || '',
            country: getInitialCountryCode(userModel.user?.country),
            city: userModel.user?.city || '',
            birthday: userModel.user?.birthday || '',
            gender: userModel.user?.gender || '',
            occupation: userModel.user?.occupation || '',
            placeOfWork: userModel.user?.wineryName || '',
            instagramLink: userModel.user?.instagramLink || '',
            website: userModel.user?.website || '',
            bio: userModel.user?.bio || '',
        };
    }, [normalizeE164Phone]);
    const [form, setForm] = useState<IProfileForm>(getInitialForm);
    const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
    const [isInProgress, setIsInProgress] = useState(false);
    const [countryCode, setCountryCode] = useState(getCallingCodeFromUser);
    const [expertiseLevel, setExpertiseLevel] = useState<WineExperienceLevelEnum>(
        userModel.user?.wineExperienceLevel || WineExperienceLevelEnum.LOVER
    );
    const [expertiseLevelChanged, setExpertiseLevelChanged] = useState(false);
    const [countryCodeChanged, setCountryCodeChanged] = useState(false);
    const selectExpertiseModalRef = useRef<BottomSheetModal | null>(null);
    const selectCityModalRef = useRef<BottomSheetModal | null>(null);
    const isCountryCodeInitializedRef = useRef(!!getCallingCodeFromUser());
    const [citySearch, setCitySearch] = useState('');

    const [isBirthdayModalVisible, setIsBirthdayModalVisible] = useState(false);
    const [pickerDate, setPickerDate] = useState<Date>(() => {
        if (userModel.user?.birthday) {
            const parsed = new Date(userModel.user.birthday);
            if (!Number.isNaN(parsed.getTime())) {
                return parsed;
            }
        }
        return new Date();
    });
    const [draftBirthday, setDraftBirthday] = useState<string | null>(null);
    const currentLocale = locale || localization.locale || 'en';

    const countryOptions = useMemo<IDropdownItem[]>(() => {
        const resolvedLocale = (currentLocale || 'en').toLowerCase();
        const translationKeyMap: Record<string, string> = {
            ar: 'ara', cs: 'ces', de: 'deu', et: 'est', fi: 'fin', fr: 'fra',
            hr: 'hrv', hu: 'hun', it: 'ita', ja: 'jpn', ko: 'kor', nl: 'nld',
            fa: 'per', pl: 'pol', pt: 'por', ru: 'rus', sk: 'slk', es: 'spa',
            sr: 'srp', sv: 'swe', tr: 'tur', ur: 'urd', zh: 'zho', uk: 'ukr',
        };

        const displayNames = (() => {
            const DisplayNames = (Intl as typeof Intl & { DisplayNames?: any }).DisplayNames;
            if (typeof DisplayNames !== 'function') {
                return null;
            }

            try {
                return new DisplayNames([currentLocale], { type: 'region' });
            } catch {
                return null;
            }
        })();

        const translationKey = translationKeyMap[resolvedLocale];
        const customNames = countryDisplayNames[resolvedLocale] || null;

        return countries
            .map(item => {
                const label =
                    customNames?.[item.cca2] ||
                    (displayNames?.of(item.cca2) as string | undefined) ||
                    (translationKey ? item.translations?.[translationKey]?.common : undefined) ||
                    item.name.common;

                return {
                    label,
                    value: item.cca2,
                };
            })
            .sort((a, b) => a.label.localeCompare(b.label, currentLocale));
    }, [currentLocale]);

    const cityOptions = useMemo<IDropdownItem[]>(() => {
        return citySuggestions.map(city => ({
            label: city.description,
            value: city.description,
        }));
    }, [citySuggestions]);

    const cityEmptyStateText = useMemo(() => {
        const trimmed = citySearch.trim();
        if (!trimmed) {
            return localization.t('settings.startTypingCity');
        }

        if (!isCityLoading && !cityOptions.length) {
            return localization.t('settings.cityNotFound');
        }

        return '';
    }, [cityOptions.length, citySearch, isCityLoading]);

    const genderOptions = useMemo<IDropdownItem[]>(() => ([
        { label: localization.t('registration.genderMale'), value: 'male' },
        { label: localization.t('registration.genderFemale'), value: 'female' },
    ]), []);

    const validateInstagramLink = useCallback((link: string): boolean => {
        if (!link.trim()) {
            setInstagramLinkError(null);
            return true;
        }

        const trimmedLink = link.trim();
        
        const instagramUrlPattern = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)\/?(?:\?.*)?$/;
        const usernamePattern = /^@?([a-zA-Z0-9._]{1,30})$/;
        
        const isInstagramUrl = instagramUrlPattern.test(trimmedLink);
        const isUsername = usernamePattern.test(trimmedLink) && !trimmedLink.includes('www.') && !trimmedLink.includes('http');

        if (!isInstagramUrl && !isUsername) {
            setInstagramLinkError(localization.t('settings.invalidInstagramLink'));
            return false;
        }

        setInstagramLinkError(null);
        return true;
    }, []);

    const onChangeField = useCallback((key: keyof IProfileForm, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
        setChangedFields(prev => new Set(prev).add(key));

        if (key === 'instagramLink') {
            validateInstagramLink(value);
        }
    }, [validateInstagramLink]);

    const onRefetchUser = useCallback(async () => {
        const response = await userService.me();
        if (!response.isError) {
            setForm(getInitialForm());
            setChangedFields(new Set());
            setExpertiseLevel(userModel.user?.wineExperienceLevel || WineExperienceLevelEnum.LOVER);
            setExpertiseLevelChanged(false);
            const callingCode = getCallingCodeFromUser();
            setCountryCode(callingCode);
            setCountryCodeChanged(false);
            isCountryCodeInitializedRef.current = !!callingCode;
        }
    }, [getInitialForm, getCallingCodeFromUser]);

    const onOpenBirthdayModal = useCallback(() => {
        if (form.birthday) {
            const parsed = new Date(form.birthday);
            if (!Number.isNaN(parsed.getTime())) {
                setPickerDate(parsed);
                setDraftBirthday(parsed.toISOString());
            }
        } else {
            const now = new Date();
            setPickerDate(now);
            setDraftBirthday(now.toISOString());
        }

        setIsBirthdayModalVisible(true);
    }, [form.birthday]);

    const onCloseBirthdayModal = useCallback(() => {
        setIsBirthdayModalVisible(false);
    }, []);

    const onChangePickerDate = useCallback((date: Date) => {
        setPickerDate(date);
        setDraftBirthday(date.toISOString());
    }, []);

    const onConfirmBirthday = useCallback(() => {
        if (draftBirthday) {
            setForm(prev => ({ ...prev, birthday: draftBirthday }));
            setChangedFields(prev => new Set(prev).add('birthday'));
        }
        setIsBirthdayModalVisible(false);
    }, [draftBirthday]);

    useFocusEffect(
        useCallback(() => {
            onRefetchUser();
        }, [onRefetchUser])
    );

    const onChangeCountryCode = useCallback((value: string) => {
        const callingCode = getCallingCodeFromUser();
        const isInitialValue = isCountryCodeInitializedRef.current && value === callingCode;

        if (isInitialValue) {
            isCountryCodeInitializedRef.current = false;
            setCountryCode(value);
            setCountryCodeChanged(false);
            return;
        }

        isCountryCodeInitializedRef.current = false;
        setCountryCode(value);
        setCountryCodeChanged(value !== callingCode);
    }, [getCallingCodeFromUser]);

    const onSave = useCallback(async () => {
        const fullName = form.fullName.trim();
        if (!fullName) {
            return;
        }

        try {
            setIsInProgress(true);

            const formData = new FormData();

            if (changedFields.has('fullName')) {
                const [firstName = '', ...rest] = fullName.split(' ');
                const lastName = rest.join(' ');
                formData.append('firstName', firstName);
                formData.append('lastName', lastName);
            }

            if (changedFields.has('email')) {
                formData.append('email', form.email.trim());
            }

            if (changedFields.has('phoneNumber') || countryCodeChanged) {
                const rawPhone = form.phoneNumber.trim();
                const phoneNumber = rawPhone.startsWith('+')
                    ? rawPhone
                    : `${countryCode}${rawPhone}`.replace(/\s+/g, '');
                formData.append('phoneNumber', phoneNumber);
            }

            if (changedFields.has('country')) {
                formData.append('country', form.country.trim());
            }

            if (changedFields.has('city')) {
                formData.append('city', form.city.trim());
            }

            if (changedFields.has('birthday')) {
                formData.append('birthday', form.birthday);
            }

            if (changedFields.has('gender')) {
                formData.append('gender', form.gender);
            }

            if (expertiseLevelChanged) {
                formData.append('wineExperienceLevel', expertiseLevel);
            }

            if (changedFields.has('occupation')) {
                formData.append('occupation', form.occupation.trim());
            }

            if (changedFields.has('placeOfWork')) {
                formData.append('wineryName', form.placeOfWork.trim());
            }

            if (changedFields.has('instagramLink')) {
                formData.append('instagramLink', form.instagramLink.trim());
            }

            if (changedFields.has('website')) {
                formData.append('website', form.website.trim());
            }

            if (changedFields.has('bio')) {
                formData.append('bio', form.bio.trim());
            }

            if (shouldRemoveAvatar) {
                formData.append('removeAvatar', 'true');
                console.log('📝 Removing avatar, removeAvatar flag set');
            } else if (isAvatarChanged && selectedAvatarImage) {
                formData.append('image', selectedAvatarImage as any);
                console.log('📸 Avatar image added to FormData:', selectedAvatarImage);
            }

            console.log('📤 Sending FormData with _parts:', (formData as any)._parts);
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
                                setChangedFields(new Set());
                setExpertiseLevelChanged(false);
                setCountryCodeChanged(false);
                setSelectedAvatarImage(null);
                setIsAvatarChanged(false);
                setShouldRemoveAvatar(false);
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error updating profile: ', JSON.stringify(error, null, 4));
        } finally {
            setIsInProgress(false);
        }
    }, [form, expertiseLevel, countryCode, changedFields, expertiseLevelChanged, countryCodeChanged, isAvatarChanged, shouldRemoveAvatar, selectedAvatarImage, navigation]);

    const isDisabled = useMemo(() => {
        const hasChanges = changedFields.size > 0 || expertiseLevelChanged || countryCodeChanged || isAvatarChanged || shouldRemoveAvatar;
        return !form.fullName.trim() || !form.email.trim() || isInProgress || !hasChanges || !!instagramLinkError;
    }, [form, isInProgress, changedFields, expertiseLevelChanged, countryCodeChanged, isAvatarChanged, shouldRemoveAvatar, instagramLinkError]);

    const birthdayDisplayText = useMemo(() => {
        if (!form.birthday) {
            return '';
        }

        const selectedDate = new Date(form.birthday);
        if (Number.isNaN(selectedDate.getTime())) {
            return '';
        }

        try {
            return new Intl.DateTimeFormat(currentLocale, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }).format(selectedDate);
        } catch {
            return format(selectedDate, 'MMMM d, yyyy');
        }
    }, [form.birthday, currentLocale]);

    const onChangeCountry = useCallback((item: IDropdownItem) => {
        const value = String(item.value || '').toUpperCase();

        if (!value) {
            onChangeField('country', '');
            onChangeField('city', '');
            setCitySearch('');
            clearCitySuggestions();
            onCountryChanged('');
            return;
        }

        if (value !== form.country) {
            onChangeField('city', '');
            setCitySearch('');
            clearCitySuggestions();
            onCountryChanged(value);
        }

        onChangeField('country', value);
    }, [clearCitySuggestions, form.country, onChangeField, onCountryChanged]);

    const onOpenCitySelector = useCallback(() => {
        if (!form.country) {
            return;
        }

        selectCityModalRef.current?.present();
    }, [form.country]);

    const onCloseCitySelector = useCallback(() => {
        Keyboard.dismiss();
        setCitySearch('');
        clearCitySuggestions();
        selectCityModalRef.current?.dismiss();
    }, [clearCitySuggestions]);

    const onSearchCityChange = useCallback((value: string) => {
        setCitySearch(value);
        searchCities(value, form.country);
    }, [form.country, searchCities]);

    const onSelectCityOption = useCallback((item: IDropdownItem) => {
        const value = String(item.value || '');
        onChangeField('city', value);
        onSelectCity();
        onCloseCitySelector();
    }, [onChangeField, onCloseCitySelector, onSelectCity]);

    const onShowDeleteAvatarAlert = useCallback(() => {
        setIsDeleteAvatarAlertVisible(true);
    }, []);

    const onCloseDeleteAvatarAlert = useCallback(() => {
        setIsDeleteAvatarAlertVisible(false);
    }, []);

    const onConfirmDeleteAvatar = useCallback(() => {
        setSelectedAvatarImage(null);
        setShouldRemoveAvatar(true);
        setIsAvatarChanged(false);
        setIsDeleteAvatarAlertVisible(false);
    }, []);

    const onCancelDeletion = useCallback(() => {
        setShouldRemoveAvatar(false);
    }, []);

    const onEditModeBackHandler = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const hasAvatar = useMemo(() => {
        return !shouldRemoveAvatar && (!!selectedAvatarImage || !!userModel.user?.avatarUrl);
    }, [selectedAvatarImage, shouldRemoveAvatar]);

    useEffect(() => {
        const params = route.params as { selectedAvatar?: { uri: string; name: string; type: string } } | undefined;
        if (params?.selectedAvatar) {
            setSelectedAvatarImage(params.selectedAvatar);
            setIsAvatarChanged(true);
            setShouldRemoveAvatar(false);
        }
    }, [route.params]);

    return {
        form,
        phoneInitialCca2: getPhoneCca2FromUser(),
        avatarUrl: userModel.user?.avatarUrl || null,
        selectedAvatarUri: selectedAvatarImage?.uri || null,
        hasAvatar,
        isMarkedForDeletion: shouldRemoveAvatar,
        onOpenCamera,
        onRemoveAvatar: onShowDeleteAvatarAlert,
        onCancelDeletion,
        isDeleteAvatarAlertVisible,
        onCloseDeleteAvatarAlert,
        onConfirmDeleteAvatar,
        expertiseLevel,
        birthdayDisplayText,
        genderOptions,
        countryOptions,
        cityOptions,
        citySearch,
        cityEmptyStateText,
        isCityLoading,
        isCitySelectorDisabled: !form.country,
        onChangeField,
        onChangeCountry,
        cityModalRef: selectCityModalRef,
        onOpenCitySelector,
        onCloseCitySelector,
        onSearchCityChange,
        onSelectCityOption,
        onChangeCountryCode,
        selectExpertiseModalRef,
        onOpenExpertiseModal: () => selectExpertiseModalRef.current?.present(),
        onCloseExpertiseModal: () => selectExpertiseModalRef.current?.dismiss(),
        onSelectExpertise: (value: WineExperienceLevelEnum) => {
            setExpertiseLevel(value);
            setExpertiseLevelChanged(true);
            selectExpertiseModalRef.current?.dismiss();
        },
        isBirthdayModalVisible,
        pickerDate,
        onOpenBirthdayModal,
        onCloseBirthdayModal,
        onChangePickerDate,
        onConfirmBirthday,
        onSave,
        isDisabled,
        isInProgress,
        instagramLinkError,
        onEditModeBackHandler,
    };
};
