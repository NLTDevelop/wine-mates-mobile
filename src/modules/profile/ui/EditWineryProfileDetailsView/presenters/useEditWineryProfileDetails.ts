import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';
import { userModel } from '@/entities/users/UserModel';
import { userService } from '@/entities/users/UserService';
import { wineService } from '@/entities/wine/services/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { useWineRegion } from '@/modules/scanner/presenters/useWineRegion';
import { getProfileGalleryPhotos } from '@/modules/profile/utils/getProfileGalleryPhotos';
import { useGallery } from '@/UIKit/Gallery/presenters/useGallery';
import { PROFILE_GALLERY_MAX_PHOTOS } from '@/modules/profile/constants/profileGallery';
import { IGalleryFile } from '@/UIKit/Gallery/types/IGalleryPhoto';
import countries from 'world-countries';
import {
    getProfileBirthdayText,
    getProfileCountryName,
    getProfilePhoneParts,
} from '@/modules/profile/utils/profileUserFields';
import { IEditableWineryLink } from '@/modules/profile/types/IEditableWineryLink';
import { useProfileSinglePicker } from '@/modules/profile/presenters/useProfileSinglePicker';

interface IWineryForm {
    name: string;
    foundedYear: string;
    description: string;
    countryId: number | null;
    regionId: number | null;
    links: string[];
}

interface IUserForm {
    country: string;
    phoneNumber: string;
    birthday: string;
}

const MIN_FOUNDED_YEAR = 1000;

const getDateFromBirthday = (value: string) => {
    if (!value) return new Date();

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date() : date;
};

const formatBirthday = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getInitialForm = (): IWineryForm => {
    const winery = userModel.winery;

    return {
        name: winery?.name || '',
        foundedYear: winery?.foundedYear ? String(winery.foundedYear) : '',
        description: winery?.description || '',
        countryId: winery?.country?.id || null,
        regionId: winery?.region?.id || null,
        links: winery?.links?.length ? [...winery.links] : [''],
    };
};

export const useEditWineryProfileDetails = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [form, setForm] = useState<IWineryForm>(getInitialForm);
    const initialPhone = getProfilePhoneParts(userModel.user?.phoneNumber || '');
    const [userForm, setUserForm] = useState<IUserForm>({
        country: userModel.user?.country || '',
        phoneNumber: initialPhone.nationalNumber,
        birthday: userModel.user?.birthday || '',
    });
    const [phoneCountryCode, setPhoneCountryCode] = useState(initialPhone.callingCode);
    const [phoneCountryCodeChanged, setPhoneCountryCodeChanged] = useState(false);
    const isPhoneCountryCodeInitializedRef = useRef(false);
    const [changedUserFields, setChangedUserFields] = useState<Set<keyof IUserForm>>(new Set());
    const [isBirthdayModalVisible, setIsBirthdayModalVisible] = useState(false);
    const [pickerDate, setPickerDate] = useState(() => getDateFromBirthday(userModel.user?.birthday || ''));
    const [changedFields, setChangedFields] = useState<Set<keyof IWineryForm>>(new Set());
    const [wineryCountryOptions, setWineryCountryOptions] = useState<IDropdownItem[]>([]);
    const [isWineryCountriesLoading, setIsWineryCountriesLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMainPhoto, setSelectedMainPhoto] = useState<IGalleryFile | null>(null);
    const [removeMainPhoto, setRemoveMainPhoto] = useState(false);
    const [isDeleteMainPhotoAlertVisible, setIsDeleteMainPhotoAlertVisible] = useState(false);
    const [galleryPhotos, setGalleryPhotos] = useState(getProfileGalleryPhotos);
    const [galleryPhotoIdToDelete, setGalleryPhotoIdToDelete] = useState<string | null>(null);
    const [removeGalleryFileIds, setRemoveGalleryFileIds] = useState<number[]>([]);
    const { regions } = useWineRegion(form.countryId);

    useEffect(() => {
        const onLoadCountries = async () => {
            try {
                const response = await wineService.getCountries();
                if (response.isError || !response.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }

                setWineryCountryOptions(
                    response.data.map(country => ({
                        label: country.name,
                        value: country.id,
                    })),
                );
            } finally {
                setIsWineryCountriesLoading(false);
            }
        };

        onLoadCountries();
    }, []);

    const regionOptions = useMemo<IDropdownItem[]>(() => {
        return regions.map(region => ({
            label: region.label,
            value: Number(region.id),
        }));
    }, [regions]);

    const userCountryOptions = useMemo<IDropdownItem[]>(() => {
        return countries
            .map(country => ({
                label: getProfileCountryName(country.cca2, localization.locale),
                value: country.cca2,
            }))
            .sort((first, second) => first.label.localeCompare(second.label));
    }, []);

    const onChangeField = useCallback((field: keyof IWineryForm, value: IWineryForm[keyof IWineryForm]) => {
        setForm(currentForm => ({ ...currentForm, [field]: value }));
        setChangedFields(currentFields => new Set(currentFields).add(field));
    }, []);

    const onChangeName = useCallback((value: string) => onChangeField('name', value), [onChangeField]);
    const onChangeFoundedYear = useCallback((value: string) => onChangeField('foundedYear', value), [onChangeField]);
    const onChangeDescription = useCallback((value: string) => onChangeField('description', value), [onChangeField]);
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
    const editableLinks = useMemo<IEditableWineryLink[]>(() => {
        return form.links.map((value, index) => ({
            id: `winery-link-${index}`,
            value,
            onChangeText: nextValue => onChangeLink(index, nextValue),
            onDelete: () => onDeleteLink(index),
        }));
    }, [form.links, onChangeLink, onDeleteLink]);

    const onChangeCountry = useCallback(
        (item: IDropdownItem) => {
            onChangeField('countryId', Number(item.value));
            onChangeField('regionId', null);
        },
        [onChangeField],
    );

    const onChangeRegion = useCallback(
        (item: IDropdownItem) => {
            onChangeField('regionId', item.value === null ? null : Number(item.value));
        },
        [onChangeField],
    );

    const onChangeUserCountry = useCallback((item: IDropdownItem) => {
        setUserForm(currentForm => ({ ...currentForm, country: String(item.value) }));
        setChangedUserFields(currentFields => new Set(currentFields).add('country'));
    }, []);

    const wineryCountryPicker = useProfileSinglePicker({
        title: localization.t('settings.wineryCountry'),
        value: form.countryId,
        items: wineryCountryOptions,
        onChange: onChangeCountry,
        isLoading: isWineryCountriesLoading,
    });
    const regionPicker = useProfileSinglePicker({
        title: localization.t('registration.region'),
        value: form.regionId,
        items: regionOptions,
        onChange: onChangeRegion,
        isDisabled: !form.countryId,
    });
    const userCountryPicker = useProfileSinglePicker({
        title: localization.t('settings.userCountry'),
        value: userForm.country,
        items: userCountryOptions,
        onChange: onChangeUserCountry,
    });

    const onChangePhoneNumber = useCallback((phoneNumber: string) => {
        setUserForm(currentForm => ({ ...currentForm, phoneNumber }));
        setChangedUserFields(currentFields => new Set(currentFields).add('phoneNumber'));
    }, []);

    const onChangeCountryCode = useCallback((countryCode: string) => {
        setPhoneCountryCode(countryCode);
        if (!isPhoneCountryCodeInitializedRef.current) {
            isPhoneCountryCodeInitializedRef.current = true;
            return;
        }
        setPhoneCountryCodeChanged(true);
    }, []);

    const onOpenBirthdayModal = useCallback(() => {
        setPickerDate(getDateFromBirthday(userForm.birthday));
        setIsBirthdayModalVisible(true);
    }, [userForm.birthday]);
    const onCloseBirthdayModal = useCallback(() => setIsBirthdayModalVisible(false), []);
    const onChangePickerDate = useCallback((date: Date) => setPickerDate(date), []);
    const onConfirmBirthday = useCallback(() => {
        setUserForm(currentForm => ({ ...currentForm, birthday: formatBirthday(pickerDate) }));
        setChangedUserFields(currentFields => new Set(currentFields).add('birthday'));
        setIsBirthdayModalVisible(false);
    }, [pickerDate]);

    const onPickMainPhoto = useCallback(() => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 1 }, response => {
            const asset = response.assets?.[0];
            if (response.didCancel || response.errorCode || !asset?.uri) {
                return;
            }

            setSelectedMainPhoto({
                uri: asset.uri,
                name: asset.fileName || `winery-main-photo-${Date.now()}.jpg`,
                type: asset.type || 'image/jpeg',
            });
            setRemoveMainPhoto(false);
        });
    }, []);

    const onRequestDeleteMainPhoto = useCallback(() => setIsDeleteMainPhotoAlertVisible(true), []);
    const onCloseDeleteMainPhotoAlert = useCallback(() => setIsDeleteMainPhotoAlertVisible(false), []);
    const onConfirmDeleteMainPhoto = useCallback(() => {
        setSelectedMainPhoto(null);
        setRemoveMainPhoto(true);
        setIsDeleteMainPhotoAlertVisible(false);
    }, []);

    const onAddGalleryPhoto = useCallback(() => {
        const remainingSlots = PROFILE_GALLERY_MAX_PHOTOS - galleryPhotos.length;
        if (remainingSlots <= 0) {
            return;
        }

        launchImageLibrary({ mediaType: 'photo', selectionLimit: remainingSlots, quality: 1 }, response => {
            const timestamp = Date.now();
            const selectedPhotos = (response.assets || [])
                .slice(0, remainingSlots)
                .reduce<typeof galleryPhotos>((photos, asset, index) => {
                    if (!asset.uri) {
                        return photos;
                    }

                    const file = {
                        uri: asset.uri,
                        name: asset.fileName || `winery-gallery-${timestamp}-${index}.jpg`,
                        type: asset.type || 'image/jpeg',
                    };
                    photos.push({ id: `local-${timestamp}-${index}`, uri: asset.uri, file });

                    return photos;
                }, []);

            setGalleryPhotos(currentPhotos => [...currentPhotos, ...selectedPhotos]);
        });
    }, [galleryPhotos.length]);

    const onRequestDeleteGalleryPhoto = useCallback((id: string) => setGalleryPhotoIdToDelete(id), []);
    const onCloseDeleteGalleryPhotoAlert = useCallback(() => setGalleryPhotoIdToDelete(null), []);
    const onConfirmDeleteGalleryPhoto = useCallback(() => {
        const photo = galleryPhotos.find(item => item.id === galleryPhotoIdToDelete);
        if (typeof photo?.fileId === 'number') {
            setRemoveGalleryFileIds(currentIds => [...new Set([...currentIds, photo.fileId as number])]);
        }
        setGalleryPhotos(currentPhotos => currentPhotos.filter(item => item.id !== galleryPhotoIdToDelete));
        setGalleryPhotoIdToDelete(null);
    }, [galleryPhotoIdToDelete, galleryPhotos]);

    const gallery = useGallery({ photos: galleryPhotos, onDeletePhoto: onRequestDeleteGalleryPhoto });
    const galleryFiles = useMemo<IGalleryFile[]>(() => {
        return galleryPhotos.reduce<IGalleryFile[]>((files, photo) => {
            if (photo.file) files.push(photo.file);
            return files;
        }, []);
    }, [galleryPhotos]);

    const hasWineryChanges =
        changedFields.size > 0 ||
        !!selectedMainPhoto ||
        removeMainPhoto ||
        !!galleryFiles.length ||
        !!removeGalleryFileIds.length;
    const hasUserChanges = changedUserFields.size > 0 || phoneCountryCodeChanged;
    const hasChanges = hasWineryChanges || hasUserChanges;
    const foundedYear = Number(form.foundedYear);
    const currentYear = new Date().getFullYear();
    const isDisabled =
        !form.name.trim() ||
        !Number.isInteger(foundedYear) ||
        foundedYear < MIN_FOUNDED_YEAR ||
        foundedYear > currentYear ||
        !form.description.trim() ||
        !form.countryId ||
        !hasChanges ||
        isLoading;

    const onSave = useCallback(async () => {
        if (isDisabled) return;
        try {
            setIsLoading(true);
            if (hasWineryChanges) {
                const wineryFormData = new FormData();
                if (changedFields.has('name')) wineryFormData.append('name', form.name.trim());
                if (changedFields.has('foundedYear')) wineryFormData.append('foundedYear', String(foundedYear));
                if (changedFields.has('description')) wineryFormData.append('description', form.description.trim());
                if (changedFields.has('countryId')) wineryFormData.append('countryId', String(form.countryId));
                if (changedFields.has('regionId')) {
                    wineryFormData.append('regionId', form.regionId === null ? 'null' : String(form.regionId));
                }
                if (changedFields.has('links')) {
                    const links = form.links.map(link => link.trim()).filter(Boolean);
                    wineryFormData.append('links', JSON.stringify(links));
                }
                if (selectedMainPhoto) wineryFormData.append('mainPhoto', selectedMainPhoto as any);
                if (removeMainPhoto) wineryFormData.append('removeMainPhoto', 'true');
                galleryFiles.forEach(file => wineryFormData.append('files', file as any));
                if (removeGalleryFileIds.length) {
                    wineryFormData.append('removeGalleryFileIds', JSON.stringify(removeGalleryFileIds));
                }

                const wineryResponse = await userService.updateWinery(wineryFormData);
                if (wineryResponse.isError) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        wineryResponse.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }
            }

            if (hasUserChanges) {
                const userFormData = new FormData();
                if (changedUserFields.has('country')) userFormData.append('country', userForm.country);
                if (changedUserFields.has('birthday')) userFormData.append('birthday', userForm.birthday);
                if (changedUserFields.has('phoneNumber') || phoneCountryCodeChanged) {
                    const rawPhone = userForm.phoneNumber.trim();
                    const phoneNumber = rawPhone.startsWith('+')
                        ? rawPhone
                        : `${phoneCountryCode}${rawPhone}`.replace(/\s+/g, '');
                    userFormData.append('phoneNumber', phoneNumber);
                }

                const userResponse = await userService.update(userFormData);
                if (userResponse.isError) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        userResponse.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }
            }

            const meResponse = await userService.me();
            if (meResponse.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    meResponse.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }
            toastService.showSuccess(localization.t('common.success'), localization.t('settings.wineryUpdated'));
            navigation.goBack();
        } finally {
            setIsLoading(false);
        }
    }, [
        changedFields,
        changedUserFields,
        form,
        foundedYear,
        galleryFiles,
        hasUserChanges,
        hasWineryChanges,
        isDisabled,
        navigation,
        phoneCountryCode,
        phoneCountryCodeChanged,
        removeGalleryFileIds,
        removeMainPhoto,
        selectedMainPhoto,
        userForm,
    ]);

    const onPressBack = useCallback(() => navigation.goBack(), [navigation]);
    const mainPhotoUrl = userModel.winery?.mainPhoto?.mediumUrl || userModel.winery?.mainPhoto?.originalUrl || null;

    return {
        form,
        userForm,
        wineryCountryPicker,
        regionPicker,
        userCountryPicker,
        phoneInitialCca2: initialPhone.cca2,
        birthdayDisplayText: getProfileBirthdayText(userForm.birthday, localization.locale),
        mainPhotoUrl,
        selectedMainPhotoUri: selectedMainPhoto?.uri || null,
        removeMainPhoto,
        gallery,
        editableLinks,
        onChangeName,
        onChangeFoundedYear,
        onChangeDescription,
        onChangeCountry,
        onChangeRegion,
        onAddLink,
        onChangeUserCountry,
        onChangePhoneNumber,
        onChangeCountryCode,
        isBirthdayModalVisible,
        pickerDate,
        maximumBirthdayDate: new Date(),
        onOpenBirthdayModal,
        onCloseBirthdayModal,
        onChangePickerDate,
        onConfirmBirthday,
        onPickMainPhoto,
        onRequestDeleteMainPhoto,
        isDeleteMainPhotoAlertVisible,
        onCloseDeleteMainPhotoAlert,
        onConfirmDeleteMainPhoto,
        onAddGalleryPhoto: galleryPhotos.length < PROFILE_GALLERY_MAX_PHOTOS ? onAddGalleryPhoto : undefined,
        isDeleteGalleryPhotoAlertVisible: !!galleryPhotoIdToDelete,
        onCloseDeleteGalleryPhotoAlert,
        onConfirmDeleteGalleryPhoto,
        isDisabled,
        isLoading,
        onSave,
        onPressBack,
    };
};
