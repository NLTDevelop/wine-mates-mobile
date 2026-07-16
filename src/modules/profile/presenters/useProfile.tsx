import { localization } from '@/UIProvider/localization/Localization';
import { colorTheme } from '@/UIProvider/theme/ColorTheme';
// import { ChemicalIcon } from '@assets/icons/ChemicalIcon';
import { EventsIcon } from '@assets/icons/EventsIcon';
import { FavoriteIcon } from '@assets/icons/FavoriteIcon';
// import { FollowersIcon } from '@assets/icons/FollowersIcon';
import { HomeIcon } from '@assets/icons/HomeIcon';
import { SettingsIcon } from '@assets/icons/SettingsIcon';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo } from 'react';
import { userModel } from '@/entities/users/UserModel';
import { WineryStatusEnum } from '@/entities/winery/enums/WineryStatusEnum';
import { GlassWithWineIcon } from '@assets/icons/GlassWithWineIcon';
import { IProfileButton } from '../types/IProfileButton';

export const useProfile = (locale: string) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const winery = userModel.winery;
    const isWineryApproved = winery?.application.status === WineryStatusEnum.APPROVED;
    const userFullName = `${userModel.user?.firstName || ''} ${userModel.user?.lastName || ''}`.trim();
    const profileName = winery?.name || userFullName;
    const profileImageUrl = winery
        ? winery.mainPhoto?.mediumUrl || winery.mainPhoto?.originalUrl || winery.mainPhoto?.smallUrl || null
        : userModel.user?.avatarUrl || null;
    const profileLevelText = winery
        ? localization.t('registration.winemaker', { locale })
        : localization.t(`wineLevel.${userModel.user?.wineExperienceLevel}`, { locale });

    const onWineAndStylePress = useCallback(() => {
        navigation.navigate('WineAndStylesView');
    }, [navigation]);

    const onEventsPress = useCallback(() => {
        navigation.navigate('EventListView');
    }, [navigation]);

    // const onFollowersPress = useCallback(() => {
    //     navigation.navigate('');
    // }, [navigation]);

    const onSavedWinePress = useCallback(() => {
        navigation.navigate('SavedWinesView');
    }, [navigation]);

    // const onChemicalAnalysisPress = useCallback(() => {
    //     navigation.navigate('');
    // }, [navigation]);

    const onSettingsPress = useCallback(() => {
        navigation.navigate('SettingsView');
    }, [navigation]);

    const onMyWineryWinesPress = useCallback(() => {
        if (!isWineryApproved) {
            return;
        }

        navigation.navigate('MyWineryWinesView');
    }, [isWineryApproved, navigation]);

    const BUTTONS = useMemo<IProfileButton[]>(
        () => [
            {
                id: 1,
                text: localization.t('profile.winesAndStyles', { locale }),
                icon: <HomeIcon width={24} height={24} color={colorTheme.colors.icon} />,
                onPress: onWineAndStylePress,
            },
            {
                id: 2,
                text: localization.t('profile.events', { locale }),
                icon: <EventsIcon />,
                onPress: onEventsPress,
            },
            // {
            //     id: 3,
            //     text: localization.t('profile.followers', { locale }),
            //     icon: <FollowersIcon />,
            //     onPress: onFollowersPress,
            // },
            {
                id: 4,
                text: localization.t('profile.savedWines', { locale }),
                icon: <FavoriteIcon width={24} height={24} color={colorTheme.colors.icon} />,
                onPress: onSavedWinePress,
            },
            // {
            //     id: 5,
            //     text: localization.t('profile.chemicalAnalysis', { locale }),
            //     icon: <ChemicalIcon />,
            //     onPress: onChemicalAnalysisPress,
            // },
            {
                id: 6,
                text: localization.t('profile.myWineryWines', { locale }),
                icon: <GlassWithWineIcon color={colorTheme.colors.icon} />,
                onPress: onMyWineryWinesPress,
                disabled: !isWineryApproved,
            },
            {
                id: 7,
                text: localization.t('profile.settings', { locale }),
                icon: <SettingsIcon />,
                onPress: onSettingsPress,
            },
        ].filter(item => item.id !== 6 || !!winery),
        [
            // onChemicalAnalysisPress,
            onEventsPress,
            // onFollowersPress,
            locale,
            onSavedWinePress,
            onSettingsPress,
            onWineAndStylePress,
            onMyWineryWinesPress,
            isWineryApproved,
            winery,
        ],
    );

    return { BUTTONS, profileName, profileImageUrl, profileLevelText };
};
