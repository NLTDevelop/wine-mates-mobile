import { localization } from '@/UIProvider/localization/Localization';
import { colorTheme } from '@/UIProvider/theme/ColorTheme';
import { ChemicalIcon } from '@assets/icons/ChemicalIcon';
import { EventsIcon } from '@assets/icons/EventsIcon';
import { FavoriteIcon } from '@assets/icons/FavoriteIcon';
import { FollowersIcon } from '@assets/icons/FollowersIcon';
import { HomeIcon } from '@assets/icons/HomeIcon';
import { SettingsIcon } from '@assets/icons/SettingsIcon';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';

export const useProfile = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onWineAndStylePress = useCallback(() => {
        navigation.navigate('');
    }, [navigation]);

    const onEventsPress = useCallback(() => {
        navigation.navigate('');
    }, [navigation]);

    const onFollowersPress = useCallback(() => {
        navigation.navigate('');
    }, [navigation]);

    const onSavedWinePress = useCallback(() => {
        navigation.navigate('SavedWinesView');
    }, [navigation]);

    const onChemicalAnalysisPress = useCallback(() => {
        navigation.navigate('');
    }, [navigation]);

    const onSettingsPress = useCallback(() => {
        navigation.navigate('SettingsView');
    }, [navigation]);

    const BUTTONS = [
        {
            id: 1,
            text: localization.t('profile.winesAndStyles'),
            icon: <HomeIcon width={24} height={24} color={colorTheme.colors.icon} />,
            onPress: onWineAndStylePress,
        },
        {
            id: 2,
            text: localization.t('profile.events'),
            icon: <EventsIcon />,
            onPress: onEventsPress,
        },
        {
            id: 3,
            text: localization.t('profile.followers'),
            icon: <FollowersIcon />,
            onPress: onFollowersPress,
        },
        {
            id: 4,
            text: localization.t('profile.savedWines'),
            icon: <FavoriteIcon width={24} height={24} color={colorTheme.colors.icon} />,
            onPress: onSavedWinePress,
        },
        {
            id: 5,
            text: localization.t('profile.chemicalAnalysis'),
            icon: <ChemicalIcon />,
            onPress: onChemicalAnalysisPress,
        },
        {
            id: 6,
            text: localization.t('profile.settings'),
            icon: <SettingsIcon />,
            onPress: onSettingsPress,
        },
    ];

    return { BUTTONS };
};
