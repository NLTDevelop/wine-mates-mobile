import { localization } from '@/UIProvider/localization/Localization';
import { colorTheme } from '@/UIProvider/theme/ColorTheme';
import { ChemicalIcon } from '@assets/icons/ChemicalIcon';
import { EventsIcon } from '@assets/icons/EventsIcon';
import { FavoriteIcon } from '@assets/icons/FavoriteIcon';
import { FollowersIcon } from '@assets/icons/FollowersIcon';
import { HomeIcon } from '@assets/icons/HomeIcon';
import { SettingsIcon } from '@assets/icons/SettingsIcon';
import { useCallback } from 'react';

export const useProfile = () => {
    const BUTTONS = [
        {
            id: 1,
            text: localization.t('profile.winesAndStyles'),
            icon: <HomeIcon width={24} height={24} color={colorTheme.colors.icon} />,
            onPress: () => {},
        },
        {
            id: 2,
            text: localization.t('profile.events'),
            icon: <EventsIcon />,
            onPress: () => {},
        },
        {
            id: 3,
            text: localization.t('profile.followers'),
            icon: <FollowersIcon />,
            onPress: () => {},
        },
        {
            id: 4,
            text: localization.t('profile.savedWines'),
            icon: <FavoriteIcon width={24} height={24} color={colorTheme.colors.icon}/>,
            onPress: () => {},
        },
        {
            id: 5,
            text: localization.t('profile.chemicalAnalysis'),
            icon: <ChemicalIcon />,
            onPress: () => {},
        },
        {
            id: 6,
            text: localization.t('profile.settings'),
            icon: <SettingsIcon />,
            onPress: () => {},
        },
    ];

    // const handleLogout = useCallback(() => {
    //     userModel.token = null;
    // }, []);

    return { BUTTONS };
};
