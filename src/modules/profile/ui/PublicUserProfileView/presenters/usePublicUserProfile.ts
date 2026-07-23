import { useCallback, useMemo, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PublicProfileTab } from '@/modules/profile/enums/PublicProfileTab';
import { IPublicProfileRouteParams } from '@/modules/profile/types/IPublicProfileRouteParams';
import { IPublicProfileTabItem } from '@/modules/profile/types/IPublicProfileTabItem';
import { usePublicProfileData } from '@/modules/profile/presenters/usePublicProfileData';
import { usePublicProfileEvents } from '@/modules/profile/presenters/usePublicProfileEvents';
import { usePublicUserTastings } from '@/modules/profile/presenters/usePublicUserTastings';
import { useWineShareModal } from '@/UIKit/WineShareModal/presenters/useWineShareModal';
import { localization } from '@/UIProvider/localization/Localization';

type RouteList = {
    PublicUserProfileView: IPublicProfileRouteParams;
};

export const usePublicUserProfile = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<RouteProp<RouteList, 'PublicUserProfileView'>>();
    const userId = route.params?.userId;
    const [activeTab, setActiveTab] = useState(PublicProfileTab.EVENTS);
    const profileData = usePublicProfileData(userId, 'user');
    const eventsData = usePublicProfileEvents(userId);
    const tastingsData = usePublicUserTastings(userId);
    const shareData = useWineShareModal();

    const onPressBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onActivityPress = useCallback(() => undefined, []);
    const onEventsPress = useCallback(() => {
        setActiveTab(PublicProfileTab.EVENTS);
    }, []);

    const onTastingsPress = useCallback(() => {
        setActiveTab(PublicProfileTab.TASTINGS);
    }, []);

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
                isSelected: activeTab === PublicProfileTab.EVENTS,
                isDisabled: false,
                onPress: onEventsPress,
            },
            {
                key: PublicProfileTab.TASTINGS,
                title: localization.t('publicProfile.tastings'),
                isSelected: activeTab === PublicProfileTab.TASTINGS,
                isDisabled: false,
                onPress: onTastingsPress,
            },
        ],
        [activeTab, onActivityPress, onEventsPress, onTastingsPress],
    );

    const onRefresh = useCallback(async () => {
        const requests = [profileData.loadProfile()];

        if (activeTab === PublicProfileTab.EVENTS) {
            requests.push(eventsData.onRefreshEvents());
        } else if (activeTab === PublicProfileTab.TASTINGS) {
            requests.push(tastingsData.onRefreshTastings());
        }

        await Promise.all(requests);
    }, [activeTab, eventsData, profileData, tastingsData]);

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
        ...tastingsData,
        ...shareData,
        activeTab,
        tabs,
        fullName,
        avatarUrl,
        isFollowDisabled: true,
        onPressBack,
        onFollowPress,
        onRefresh,
    };
};
