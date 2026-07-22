import { useCallback } from 'react';
import { InteractionManager } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { userModel } from '@/entities/users/UserModel';
import { userService } from '@/entities/users/UserService';
import { localization } from '@/UIProvider/localization/Localization';
import { getProfileGalleryPhotos } from '@/modules/profile/utils/getProfileGalleryPhotos';
import { useGallery } from '@/UIKit/Gallery/presenters/useGallery';
import { getProfileBirthdayText, getProfileCountryName } from '@/modules/profile/utils/profileUserFields';
import { getProfileLinkItems } from '@/modules/profile/utils/getProfileLinkItems';

const getField = (value: string | number | null | undefined, placeholder: string) => {
    const hasValue = value !== null && value !== undefined && String(value).trim().length > 0;

    return {
        text: hasValue ? String(value) : placeholder,
        isPlaceholder: !hasValue,
    };
};

export const useWineryProfileDetails = (locale: string) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const winery = userModel.winery;
    const user = userModel.user;
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

    const onPressBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onPressEdit = useCallback(() => {
        navigation.navigate('EditWineryProfileDetailsView');
    }, [navigation]);

    const getLabeledField = (value: string | number | null | undefined, label: string) => ({
        ...getField(value, label),
        label,
    });
    const fields = {
        name: getLabeledField(winery?.name, localization.t('registration.wineryName', { locale })),
        foundedYear: getLabeledField(winery?.foundedYear, localization.t('registration.foundedYear', { locale })),
        description: getLabeledField(winery?.description, localization.t('registration.wineryDescription', { locale })),
        wineryCountry: getLabeledField(winery?.country?.name, localization.t('settings.wineryCountry', { locale })),
        region: getLabeledField(winery?.region?.name, localization.t('registration.region', { locale })),
        userCountry: getLabeledField(
            getProfileCountryName(user?.country || '', locale),
            localization.t('settings.userCountry', { locale }),
        ),
        phone: getLabeledField(user?.phoneNumber, localization.t('settings.phoneNumber', { locale })),
        birthday: getLabeledField(
            getProfileBirthdayText(user?.birthday || '', locale),
            localization.t('registration.birthday', { locale }),
        ),
    };
    const linkItems = getProfileLinkItems(winery?.links || []);

    return {
        name: winery?.name || '',
        mainPhotoUrl:
            winery?.mainPhoto?.mediumUrl || winery?.mainPhoto?.originalUrl || winery?.mainPhoto?.smallUrl || null,
        fields,
        linkItems,
        gallery,
        onPressBack,
        onPressEdit,
    };
};
