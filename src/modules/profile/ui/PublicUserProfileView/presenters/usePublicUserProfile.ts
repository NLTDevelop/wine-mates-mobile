import { useCallback, useMemo } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PublicProfileTab } from '@/modules/profile/enums/PublicProfileTab';
import { IPublicProfileRouteParams } from '@/modules/profile/types/IPublicProfileRouteParams';
import { IPublicProfileTabItem } from '@/modules/profile/types/IPublicProfileTabItem';
import { usePublicProfileData } from '@/modules/profile/presenters/usePublicProfileData';
import { usePublicProfileEvents } from '@/modules/profile/presenters/usePublicProfileEvents';
import { localization } from '@/UIProvider/localization/Localization';

type RouteList = {
    PublicUserProfileView: IPublicProfileRouteParams;
};

export const usePublicUserProfile = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<RouteProp<RouteList, 'PublicUserProfileView'>>();
    const userId = route.params?.userId;
    const profileData = usePublicProfileData(userId, 'user');
    const eventsData = usePublicProfileEvents(userId);

    const onPressBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onActivityPress = useCallback(() => undefined, []);
    const onEventsPress = useCallback(() => undefined, []);
    const onFollowPress = useCallback(() => undefined, []);

    const tabs = useMemo<IPublicProfileTabItem[]>(
        () => [
            {
                key: PublicProfileTab.ACTIVITY,
                title: localization.t('publicProfile.activity'),
                isSelected: false,
                isDisabled: true,
                onPress: onActivityPress,
            },
            {
                key: PublicProfileTab.EVENTS,
                title: localization.t('publicProfile.events'),
                isSelected: true,
                isDisabled: false,
                onPress: onEventsPress,
            },
        ],
        [onActivityPress, onEventsPress],
    );

    const onRefresh = useCallback(async () => {
        await Promise.all([profileData.loadProfile(), eventsData.onRefreshEvents()]);
    }, [eventsData, profileData]);

    const fullName = useMemo(() => {
        return `${profileData.profile?.user.firstName || ''} ${profileData.profile?.user.lastName || ''}`.trim();
    }, [profileData.profile]);

    const avatarUrl = useMemo(() => {
        const avatar = profileData.profile?.user.avatar;
        return avatar?.mediumUrl || avatar?.originalUrl || avatar?.smallUrl || null;
    }, [profileData.profile]);

    return {
        ...profileData,
        ...eventsData,
        tabs,
        fullName,
        avatarUrl,
        isFollowDisabled: true,
        onPressBack,
        onFollowPress,
        onRefresh,
    };
};
