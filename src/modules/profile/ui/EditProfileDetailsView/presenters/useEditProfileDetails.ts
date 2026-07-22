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
import { InteractionManager, Keyboard } from 'react-native';
import { useCurrencyPickerModal } from '@/UIKit/CurrencyPicker/presenters/useCurrencyPickerModal';
import { useUserCurrencies } from '@/UIKit/CurrencyPicker/presenters/useUserCurrencies';
import { launchImageLibrary } from 'react-native-image-picker';
import { getProfileGalleryPhotos } from '@/modules/profile/utils/getProfileGalleryPhotos';
import { useGallery } from '@/UIKit/Gallery/presenters/useGallery';
import { PROFILE_GALLERY_MAX_PHOTOS } from '@/modules/profile/constants/profileGallery';
import { IGalleryFile } from '@/UIKit/Gallery/types/IGalleryPhoto';
import { useProfileSinglePicker } from '@/modules/profile/presenters/useProfileSinglePicker';
import { IEditableProfileLink } from '@/modules/profile/types/IEditableProfileLink';

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
    links: string[];
    bio: string;
    selectedCurrency: string;
}

const formatDateToLocalApi = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const getLocalDateFromApi = (value: string) => {
    const parts = value.split('-');
    if (parts.length !== 3) {
        return null;
    }

    const [yearString, monthString, dayString] = parts;
    const year = Number(yearString);
    const month = Number(monthString);
    const day = Number(dayString);

    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
        return null;
    }

    return new Date(year, month - 1, day);
};

const getDateFromBirthday = (value: string) => {
    if (!value) {
        return null;
    }

    const localDate = getLocalDateFromApi(value);
    if (localDate) {
        return localDate;
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return parsedDate;
};

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
    const { citySuggestions, isCityLoading, searchCities, onCountryChanged, onSelectCity, clearCitySuggestions } =
        useLocation();
    const { onOpenCamera } = useAvatarPicker();
    const [selectedAvatarImage, setSelectedAvatarImage] = useState<{ uri: string; name: string; type: string } | null>(
        null,
    );
    const [isAvatarChanged, setIsAvatarChanged] = useState(false);
    const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);
    const [isDeleteAvatarAlertVisible, setIsDeleteAvatarAlertVisible] = useState(false);
    const [galleryPhotos, setGalleryPhotos] = useState(getProfileGalleryPhotos);
    const [galleryPhotoIdToDelete, setGalleryPhotoIdToDelete] = useState<string | null>(null);
    const [removeGalleryFileIds, setRemoveGalleryFileIds] = useState<number[]>([]);
    const isGalleryChangedRef = useRef(false);
    const { currencies, isCurrenciesLoading, onLoadCurrencies } = useUserCurrencies();
    const [isDeferredContentReady, setIsDeferredContentReady] = useState(false);

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
            links: (() => {
                if (Array.isArray(userModel.user?.links)) {
                    const links = userModel.user.links.map(link => link.trim()).filter(Boolean);
                    return links.length ? links : [''];
                }

                const legacyLinks = [userModel.user?.website, userModel.user?.instagramLink]
                    .map(link => link?.trim() || '')
                    .filter(Boolean);

                return legacyLinks.length ? [...new Set(legacyLinks)] : [''];
            })(),
            bio: userModel.user?.bio || '',
            selectedCurrency: userModel.user?.selectedCurrency || '',
        };
    }, [normalizeE164Phone]);
    const [form, setForm] = useState<IProfileForm>(getInitialForm);
    const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
    const [isInProgress, setIsInProgress] = useState(false);
    const [countryCode, setCountryCode] = useState(getCallingCodeFromUser);
    const [expertiseLevel, setExpertiseLevel] = useState<WineExperienceLevelEnum>(
        userModel.user?.wineExperienceLevel || WineExperienceLevelEnum.LOVER,
    );
    const [expertiseLevelChanged, setExpertiseLevelChanged] = useState(false);
    const [countryCodeChanged, setCountryCodeChanged] = useState(false);
    const selectExpertiseModalRef = useRef<BottomSheetModal | null>(null);
    const selectCityModalRef = useRef<BottomSheetModal | null>(null);
    const isCountryCodeInitializedRef = useRef(!!getCallingCodeFromUser());
    const [citySearch, setCitySearch] = useState('');

    const [isBirthdayModalVisible, setIsBirthdayModalVisible] = useState(false);
    const [pickerDate, setPickerDate] = useState<Date>(() => {
        const birthdayDate = getDateFromBirthday(userModel.user?.birthday || '');
        if (birthdayDate) {
            return birthdayDate;
        }

        return new Date();
    });
    const [draftBirthday, setDraftBirthday] = useState<string | null>(null);
    const currentLocale = locale || localization.locale || 'en';

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            setIsDeferredContentReady(true);
        });

        return () => {
            task.cancel();
        };
    }, []);

    const countryOptions = useMemo<IDropdownItem[]>(() => {
        if (!isDeferredContentReady) {
            return form.country
                ? [
                      {
                          label: form.country,
                          value: form.country,
                      },
                  ]
                : [];
        }

        const resolvedLocale = (currentLocale || 'en').toLowerCase();
        const translationKeyMap: Record<string, string> = {
            ar: 'ara',
            cs: 'ces',
            de: 'deu',
            et: 'est',
            fi: 'fin',
            fr: 'fra',
            hr: 'hrv',
            hu: 'hun',
            it: 'ita',
            ja: 'jpn',
            ko: 'kor',
            nl: 'nld',
            fa: 'per',
            pl: 'pol',
            pt: 'por',
            ru: 'rus',
            sk: 'slk',
            es: 'spa',
            sr: 'srp',
            sv: 'swe',
            tr: 'tur',
            ur: 'urd',
            zh: 'zho',
            uk: 'ukr',
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
    }, [currentLocale, form.country, isDeferredContentReady]);

    const cityOptions = useMemo<IDropdownItem[]>(() => {
        if (!isDeferredContentReady) {
            return [];
        }

        return citySuggestions.map(city => ({
            label: city.description,
            value: city.description,
        }));
    }, [citySuggestions, isDeferredContentReady]);

    const cityEmptyStateText = useMemo(() => {
        const trimmed = citySearch.trim();
        if (!trimmed) {
            return localization.t('settings.startTypingCity', { locale: currentLocale });
        }

        if (!isCityLoading && !cityOptions.length) {
            return localization.t('settings.cityNotFound', { locale: currentLocale });
        }

        return '';
    }, [cityOptions.length, citySearch, currentLocale, isCityLoading]);

    const genderOptions = useMemo<IDropdownItem[]>(
        () => [
            { label: localization.t('registration.genderMale', { locale: currentLocale }), value: 'male' },
            { label: localization.t('registration.genderFemale', { locale: currentLocale }), value: 'female' },
        ],
        [currentLocale],
    );

    const onChangeField = useCallback((key: keyof Omit<IProfileForm, 'links'>, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
        setChangedFields(prev => new Set(prev).add(key));
    }, []);

    const onChangeFullName = useCallback(
        (value: string) => {
            onChangeField('fullName', value);
        },
        [onChangeField],
    );

    const onChangeEmail = useCallback(
        (value: string) => {
            onChangeField('email', value);
        },
        [onChangeField],
    );

    const onChangePhoneNumber = useCallback(
        (value: string) => {
            onChangeField('phoneNumber', value);
        },
        [onChangeField],
    );

    const onChangeGender = useCallback(
        (item: IDropdownItem) => {
            onChangeField('gender', String(item.value));
        },
        [onChangeField],
    );

    const onChangeOccupation = useCallback(
        (value: string) => {
            onChangeField('occupation', value);
        },
        [onChangeField],
    );

    const onChangePlaceOfWork = useCallback(
        (value: string) => {
            onChangeField('placeOfWork', value);
        },
        [onChangeField],
    );

    const onChangeLink = useCallback((index: number, value: string) => {
        setForm(currentForm => ({
            ...currentForm,
            links: currentForm.links.map((link, linkIndex) => (linkIndex === index ? value : link)),
        }));
        setChangedFields(currentFields => new Set(currentFields).add('links'));
    }, []);

    const onDeleteLink = useCallback((index: number) => {
        setForm(currentForm => {
            const links = currentForm.links.filter((_link, linkIndex) => linkIndex !== index);
            return { ...currentForm, links: links.length ? links : [''] };
        });
        setChangedFields(currentFields => new Set(currentFields).add('links'));
    }, []);

    const onAddLink = useCallback(() => {
        setForm(currentForm => ({ ...currentForm, links: [...currentForm.links, ''] }));
        setChangedFields(currentFields => new Set(currentFields).add('links'));
    }, []);

    const editableLinks = useMemo<IEditableProfileLink[]>(() => {
        return form.links.map((value, index) => ({
            id: `profile-link-${index}`,
            value,
            onChangeText: nextValue => onChangeLink(index, nextValue),
            onDelete: () => onDeleteLink(index),
        }));
    }, [form.links, onChangeLink, onDeleteLink]);

    const onChangeBio = useCallback(
        (value: string) => {
            onChangeField('bio', value);
        },
        [onChangeField],
    );

    const onChangeCurrency = useCallback(
        (value: string) => {
            onChangeField('selectedCurrency', value);
        },
        [onChangeField],
    );

    const onLoadProfileCurrencies = useCallback(async () => {
        const data = await onLoadCurrencies();

        if (!data || !data.list.length) {
            if (!currencies.length) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            }

            return;
        }

        const availableCurrencies = data.list;

        setForm(prev => {
            if (prev.selectedCurrency && availableCurrencies.includes(prev.selectedCurrency)) {
                return prev;
            }

            return { ...prev, selectedCurrency: '' };
        });
    }, [currencies.length, onLoadCurrencies]);

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
            if (!isGalleryChangedRef.current) {
                setGalleryPhotos(getProfileGalleryPhotos());
            }
        }
    }, [getInitialForm, getCallingCodeFromUser]);

    const onOpenBirthdayModal = useCallback(() => {
        const birthdayDate = getDateFromBirthday(form.birthday);
        if (birthdayDate) {
            setPickerDate(birthdayDate);
            setDraftBirthday(formatDateToLocalApi(birthdayDate));
        } else {
            const now = new Date();
            setPickerDate(now);
            setDraftBirthday(formatDateToLocalApi(now));
        }

        setIsBirthdayModalVisible(true);
    }, [form.birthday]);

    const onCloseBirthdayModal = useCallback(() => {
        setIsBirthdayModalVisible(false);
    }, []);

    const onChangePickerDate = useCallback((date: Date) => {
        setPickerDate(date);
        setDraftBirthday(formatDateToLocalApi(date));
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
            const task = InteractionManager.runAfterInteractions(async () => {
                await onRefetchUser();
                await onLoadProfileCurrencies();
            });

            return () => {
                task.cancel();
            };
        }, [onLoadProfileCurrencies, onRefetchUser]),
    );

    const isCurrencySelectorDisabled = isCurrenciesLoading || !currencies.length;
    const currencyPicker = useCurrencyPickerModal({
        value: form.selectedCurrency,
        currencies,
        onChange: onChangeCurrency,
        isDisabled: isCurrencySelectorDisabled,
    });

    const onChangeCountryCode = useCallback(
        (value: string) => {
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
        },
        [getCallingCodeFromUser],
    );

    const galleryFiles = useMemo<IGalleryFile[]>(() => {
        return galleryPhotos.reduce<IGalleryFile[]>((files, photo) => {
            if (photo.file) {
                files.push(photo.file);
            }

            return files;
        }, []);
    }, [galleryPhotos]);

    const hasGalleryChanges = galleryFiles.length > 0 || removeGalleryFileIds.length > 0;

    const onSave = useCallback(async () => {
        const fullName = form.fullName.trim();
        if (!fullName) {
            return;
        }

        try {
            setIsInProgress(true);

            const isCurrencyChanged = changedFields.has('selectedCurrency');
            const isProfileFieldChanges = Array.from(changedFields).some(field => field !== 'selectedCurrency');
            const isProfileChanges =
                isProfileFieldChanges ||
                expertiseLevelChanged ||
                countryCodeChanged ||
                isAvatarChanged ||
                shouldRemoveAvatar ||
                hasGalleryChanges;

            if (isProfileChanges) {
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

                if (changedFields.has('links')) {
                    const links = form.links.map(link => link.trim()).filter(Boolean);
                    formData.append('links', JSON.stringify(links));
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

                galleryFiles.forEach(file => {
                    formData.append('files', file as any);
                });

                if (removeGalleryFileIds.length) {
                    formData.append('removeGalleryFileIds', JSON.stringify(removeGalleryFileIds));
                }

                console.log('📤 Sending FormData with _parts:', (formData as any)._parts);
                const response = await userService.update(formData);

                if (response.isError) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }
            }

            if (isCurrencyChanged) {
                const response = await userService.updateCurrency(form.selectedCurrency.trim());

                if (response.isError) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }
            }

            await userService.me();
            toastService.showSuccess(localization.t('common.success'), localization.t('settings.profileUpdated'));
            setChangedFields(new Set());
            setExpertiseLevelChanged(false);
            setCountryCodeChanged(false);
            setSelectedAvatarImage(null);
            setIsAvatarChanged(false);
            setShouldRemoveAvatar(false);
            setRemoveGalleryFileIds([]);
            isGalleryChangedRef.current = false;
            navigation.goBack();
        } catch (error) {
            console.error('Error updating profile: ', JSON.stringify(error, null, 4));
        } finally {
            setIsInProgress(false);
        }
    }, [
        form,
        expertiseLevel,
        countryCode,
        changedFields,
        expertiseLevelChanged,
        countryCodeChanged,
        isAvatarChanged,
        shouldRemoveAvatar,
        selectedAvatarImage,
        galleryFiles,
        removeGalleryFileIds,
        hasGalleryChanges,
        navigation,
    ]);

    const isDisabled = useMemo(() => {
        const hasChanges =
            changedFields.size > 0 ||
            expertiseLevelChanged ||
            countryCodeChanged ||
            isAvatarChanged ||
            shouldRemoveAvatar ||
            hasGalleryChanges;
        return !form.fullName.trim() || !form.email.trim() || isInProgress || !hasChanges;
    }, [
        form,
        isInProgress,
        changedFields,
        expertiseLevelChanged,
        countryCodeChanged,
        isAvatarChanged,
        shouldRemoveAvatar,
        hasGalleryChanges,
    ]);

    const birthdayDisplayText = useMemo(() => {
        if (!form.birthday) {
            return '';
        }

        const selectedDate = getDateFromBirthday(form.birthday);
        if (!selectedDate) {
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

    const onChangeCountry = useCallback(
        (item: IDropdownItem) => {
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
        },
        [clearCitySuggestions, form.country, onChangeField, onCountryChanged],
    );

    const onOpenCitySelector = useCallback(() => {
        if (!form.country) {
            return;
        }

        selectCityModalRef.current?.present();
    }, [form.country]);

    const onCloseCitySelector = useCallback(() => {
        Keyboard.dismiss();
        selectCityModalRef.current?.dismiss();
    }, []);

    const onDismissCitySelector = useCallback(() => {
        setCitySearch('');
        clearCitySuggestions();
    }, [clearCitySuggestions]);

    const onSearchCityChange = useCallback(
        (value: string) => {
            setCitySearch(value);
            searchCities(value, form.country);
        },
        [form.country, searchCities],
    );

    const onSelectCityOption = useCallback(
        (item: IDropdownItem) => {
            const value = String(item.value || '');
            onChangeField('city', value);
            onSelectCity();
            onCloseCitySelector();
        },
        [onChangeField, onCloseCitySelector, onSelectCity],
    );

    const onOpenExpertiseModal = useCallback(() => {
        selectExpertiseModalRef.current?.present();
    }, []);

    const onCloseExpertiseModal = useCallback(() => {
        selectExpertiseModalRef.current?.dismiss();
    }, []);

    const onSelectExpertise = useCallback((value: WineExperienceLevelEnum) => {
        setExpertiseLevel(value);
        setExpertiseLevelChanged(true);
        selectExpertiseModalRef.current?.dismiss();
    }, []);

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

    const onAddGalleryPhoto = useCallback(() => {
        const remainingPhotoSlots = PROFILE_GALLERY_MAX_PHOTOS - galleryPhotos.length;
        if (remainingPhotoSlots <= 0) {
            return;
        }

        launchImageLibrary({ mediaType: 'photo', selectionLimit: remainingPhotoSlots, quality: 1 }, response => {
            if (response.didCancel || response.errorCode) {
                return;
            }

            const timestamp = Date.now();
            const selectedPhotos = (response.assets || [])
                .slice(0, remainingPhotoSlots)
                .reduce<typeof galleryPhotos>((photos, asset, index) => {
                    if (!asset.uri) {
                        return photos;
                    }

                    photos.push({
                        id: `${asset.fileName || 'gallery-photo'}-${timestamp}-${index}`,
                        uri: asset.uri,
                        file: {
                            uri: asset.uri,
                            name: asset.fileName || `gallery-photo-${timestamp}-${index}.jpg`,
                            type: asset.type || 'image/jpeg',
                        },
                    });

                    return photos;
                }, []);

            if (selectedPhotos.length) {
                isGalleryChangedRef.current = true;
                setGalleryPhotos(currentPhotos => [...currentPhotos, ...selectedPhotos]);
            }
        });
    }, [galleryPhotos.length]);

    const onRequestDeleteGalleryPhoto = useCallback((id: string) => {
        setGalleryPhotoIdToDelete(id);
    }, []);

    const onCloseDeleteGalleryPhotoAlert = useCallback(() => {
        setGalleryPhotoIdToDelete(null);
    }, []);

    const onConfirmDeleteGalleryPhoto = useCallback(() => {
        if (!galleryPhotoIdToDelete) {
            return;
        }

        const photoToDelete = galleryPhotos.find(photo => photo.id === galleryPhotoIdToDelete);
        const fileId = photoToDelete?.fileId;
        if (typeof fileId === 'number') {
            setRemoveGalleryFileIds(currentIds => {
                if (currentIds.includes(fileId)) {
                    return currentIds;
                }

                return [...currentIds, fileId];
            });
        }

        isGalleryChangedRef.current = true;
        setGalleryPhotos(currentPhotos => currentPhotos.filter(photo => photo.id !== galleryPhotoIdToDelete));
        setGalleryPhotoIdToDelete(null);
    }, [galleryPhotoIdToDelete, galleryPhotos]);

    const gallery = useGallery({
        photos: galleryPhotos,
        onDeletePhoto: onRequestDeleteGalleryPhoto,
    });

    const onEditModeBackHandler = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    useEffect(() => {
        const params = route.params as { selectedAvatar?: { uri: string; name: string; type: string } } | undefined;
        if (params?.selectedAvatar) {
            const frameId = requestAnimationFrame(() => {
                setSelectedAvatarImage(params.selectedAvatar || null);
                setIsAvatarChanged(true);
                setShouldRemoveAvatar(false);
            });

            return () => {
                cancelAnimationFrame(frameId);
            };
        }
    }, [route.params]);

    const countryPicker = useProfileSinglePicker({
        title: localization.t('settings.country', { locale: currentLocale }),
        value: form.country,
        items: countryOptions,
        onChange: onChangeCountry,
    });
    const genderPicker = useProfileSinglePicker({
        title: localization.t('settings.gender', { locale: currentLocale }),
        value: form.gender,
        items: genderOptions,
        onChange: onChangeGender,
    });

    return {
        form,
        phoneInitialCca2: getPhoneCca2FromUser(),
        avatarUrl: userModel.user?.avatarUrl || null,
        selectedAvatarUri: selectedAvatarImage?.uri || null,
        isMarkedForDeletion: shouldRemoveAvatar,
        onOpenCamera,
        onRemoveAvatar: onShowDeleteAvatarAlert,
        isDeleteAvatarAlertVisible,
        onCloseDeleteAvatarAlert,
        onConfirmDeleteAvatar,
        gallery,
        onAddGalleryPhoto: galleryPhotos.length < PROFILE_GALLERY_MAX_PHOTOS ? onAddGalleryPhoto : undefined,
        isDeleteGalleryPhotoAlertVisible: !!galleryPhotoIdToDelete,
        onCloseDeleteGalleryPhotoAlert,
        onConfirmDeleteGalleryPhoto,
        expertiseLevel,
        birthdayDisplayText,
        countryPicker,
        genderPicker,
        cityOptions,
        citySearch,
        cityEmptyStateText,
        isCityLoading,
        isCitySelectorDisabled: !form.country,
        onChangeField,
        onChangeFullName,
        onChangeEmail,
        onChangePhoneNumber,
        onChangeOccupation,
        currencyPicker,
        isCurrencySelectorDisabled,
        onChangePlaceOfWork,
        editableLinks,
        onAddLink,
        onChangeBio,
        cityModalRef: selectCityModalRef,
        onOpenCitySelector,
        onCloseCitySelector,
        onDismissCitySelector,
        onSearchCityChange,
        onSelectCityOption,
        onChangeCountryCode,
        selectExpertiseModalRef,
        onOpenExpertiseModal,
        onCloseExpertiseModal,
        onSelectExpertise,
        isBirthdayModalVisible,
        pickerDate,
        onOpenBirthdayModal,
        onCloseBirthdayModal,
        onChangePickerDate,
        onConfirmBirthday,
        onSave,
        isDisabled,
        isInProgress,
        onEditModeBackHandler,
        isDeferredContentReady,
    };
};
