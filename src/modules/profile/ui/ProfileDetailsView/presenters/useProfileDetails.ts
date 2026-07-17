import { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { InteractionManager } from 'react-native';
import { userService } from '@/entities/users/UserService';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { localization } from '@/UIProvider/localization/Localization';
import { getProfileGalleryPhotos } from '@/modules/profile/utils/getProfileGalleryPhotos';
import { useGallery } from '@/UIKit/Gallery/presenters/useGallery';
import { getProfileBirthdayText, getProfileCountryName } from '@/modules/profile/utils/profileUserFields';

const getProfileField = (value: string | undefined | null, placeholder: string) => {
    const text = value || placeholder;

    return { text, isPlaceholder: !value };
};

export const useProfileDetails = (locale: string) => {
    const navigation = useNavigation<any>();
    const gallery = useGallery({ photos: getProfileGalleryPhotos() });

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                userService.me();
            });

            return () => {
                task.cancel();
            };
        }, []),
    );

    const fullName = `${userModel.user?.firstName || ''} ${userModel.user?.lastName || ''}`.trim();
    const expertiseLevel = userModel.user?.wineExperienceLevel || WineExperienceLevelEnum.LOVER;
    const expertiseLabel =
        expertiseLevel === WineExperienceLevelEnum.EXPERT
            ? localization.t('registration.wineExpert', { locale })
            : expertiseLevel === WineExperienceLevelEnum.CREATOR
              ? localization.t('registration.winemaker', { locale })
              : localization.t('registration.wineLover', { locale });
    const birthdayDisplayText = getProfileBirthdayText(userModel.user?.birthday || '', locale);
    const email = userModel.user?.email || '';
    const country = getProfileCountryName(userModel.user?.country || '', locale);
    const city = userModel.user?.city || '';
    const gender =
        userModel.user?.gender === 'male'
            ? localization.t('registration.genderMale', { locale })
            : userModel.user?.gender === 'female'
              ? localization.t('registration.genderFemale', { locale })
              : '';
    const occupation = userModel.user?.occupation || '';
    const placeOfWork = userModel.user?.wineryName || '';
    const instagramLink = userModel.user?.instagramLink || '';
    const website = userModel.user?.website || '';
    const bio = userModel.user?.bio || '';
    const selectedCurrency = userModel.user?.selectedCurrency || '';

    const fields = {
        fullName: {
            ...getProfileField(fullName, localization.t('settings.fullName', { locale })),
            label: localization.t('settings.fullName', { locale }),
        },
        email: {
            ...getProfileField(email, localization.t('settings.email', { locale })),
            label: localization.t('settings.email', { locale }),
        },
        phone: {
            ...getProfileField(userModel.user?.phoneNumber, localization.t('settings.phoneNumber', { locale })),
            label: localization.t('settings.phoneNumber', { locale }),
        },
        country: {
            ...getProfileField(country, localization.t('settings.country', { locale })),
            label: localization.t('settings.country', { locale }),
        },
        city: {
            ...getProfileField(city, localization.t('settings.city', { locale })),
            label: localization.t('settings.city', { locale }),
        },
        birthday: {
            ...getProfileField(birthdayDisplayText, localization.t('registration.birthday', { locale })),
            label: localization.t('registration.birthday', { locale }),
        },
        gender: {
            ...getProfileField(gender, localization.t('settings.gender', { locale })),
            label: localization.t('settings.gender', { locale }),
        },
        occupation: {
            ...getProfileField(occupation, localization.t('settings.occupation', { locale })),
            label: localization.t('settings.occupation', { locale }),
        },
        placeOfWork: {
            ...getProfileField(placeOfWork, localization.t('settings.placeOfWork', { locale })),
            label: localization.t('settings.placeOfWork', { locale }),
        },
        selectedCurrency: {
            ...getProfileField(selectedCurrency, localization.t('settings.selectedCurrency', { locale })),
            label: localization.t('settings.selectedCurrency', { locale }),
        },
        instagram: {
            ...getProfileField(instagramLink, localization.t('settings.instagram', { locale })),
            label: localization.t('settings.instagramLabel', { locale }),
        },
        website: {
            ...getProfileField(website, localization.t('settings.website', { locale })),
            label: localization.t('settings.websiteLabel', { locale }),
        },
        bio: {
            ...getProfileField(bio, localization.t('settings.bio', { locale })),
            label: localization.t('settings.bio', { locale }),
        },
    };

    const onPressBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onPressEdit = useCallback(() => {
        navigation.navigate('EditProfileDetailsView');
    }, [navigation]);

    return {
        avatarUrl: userModel.user?.avatarUrl || null,
        fullName,
        expertiseLevel,
        expertiseLabel,
        fields,
        gallery,
        onPressBack,
        onPressEdit,
    };
};
