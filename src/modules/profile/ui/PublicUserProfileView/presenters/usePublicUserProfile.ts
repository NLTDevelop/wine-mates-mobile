import { useCallback, useMemo, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PublicProfileTab } from '@/modules/profile/enums/PublicProfileTab';
import { IPublicProfileRouteParams } from '@/modules/profile/types/IPublicProfileRouteParams';
import { IPublicProfileTabItem } from '@/modules/profile/types/IPublicProfileTabItem';
import { usePublicProfileData } from '@/modules/profile/presenters/usePublicProfileData';
import { usePublicProfileEvents } from '@/modules/profile/presenters/usePublicProfileEvents';
import { usePublicUserTastings } from '@/modules/profile/presenters/usePublicUserTastings';
import { usePublicUserOffers } from '@/modules/profile/presenters/usePublicUserOffers';
import { useWineShareModal } from '@/UIKit/WineShareModal/presenters/useWineShareModal';
import { localization } from '@/UIProvider/localization/Localization';

type RouteList = {
    PublicUserProfileView: IPublicProfileRouteParams;
};

export const usePublicUserProfile = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<RouteProp<RouteList, 'PublicUserProfileView'>>();
    const userId = route.params?.userId;
    const initialProfile = route.params?.initialProfile;
    const [activeTab, setActiveTab] = useState(route.params?.initialTab ?? PublicProfileTab.EVENTS);
    const profileData = usePublicProfileData(userId, 'user', initialProfile);
    const eventsData = usePublicProfileEvents(userId, activeTab === PublicProfileTab.EVENTS);
    const tastingsData = usePublicUserTastings(userId, activeTab === PublicProfileTab.TASTINGS);
    const offersData = usePublicUserOffers(userId, activeTab === PublicProfileTab.WINES);
    const shareData = useWineShareModal();

    const onPressBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onActivityPress = useCallback(() => undefined, []);
    const onEventsPress = useCallback(() => {
        if (activeTab === PublicProfileTab.TASTINGS) {
            tastingsData.onResetTastingsSearch();
        }
        setActiveTab(PublicProfileTab.EVENTS);
    }, [activeTab, tastingsData]);

    const onTastingsPress = useCallback(() => {
        setActiveTab(PublicProfileTab.TASTINGS);
    }, []);

    const onWinesPress = useCallback(() => {
        setActiveTab(PublicProfileTab.WINES);
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
            {
                key: PublicProfileTab.WINES,
                title: localization.t('publicProfile.offers'),
                isSelected: activeTab === PublicProfileTab.WINES,
                isDisabled: false,
                onPress: onWinesPress,
            },
        ],
        [activeTab, onActivityPress, onEventsPress, onTastingsPress, onWinesPress],
    );

    const onRefresh = useCallback(async () => {
        const requests = [profileData.loadProfile()];

        if (activeTab === PublicProfileTab.EVENTS) {
            requests.push(eventsData.onRefreshEvents());
        } else if (activeTab === PublicProfileTab.TASTINGS) {
            requests.push(tastingsData.onRefreshTastings());
        } else if (activeTab === PublicProfileTab.WINES) {
            requests.push(offersData.onRefreshOffers());
        }

        await Promise.all(requests);
    }, [activeTab, eventsData, offersData, profileData, tastingsData]);

    const fullName = useMemo(() => {
        return `${profileData.profile?.user.firstName || ''} ${profileData.profile?.user.lastName || ''}`.trim();
    }, [profileData.profile]);

    const avatarUrl = useMemo(() => {
        const avatar = profileData.profile?.user.avatar;
        return avatar?.mediumUrl || avatar?.originalUrl || avatar?.smallUrl || null;
    }, [profileData.profile]);

    const bio = useMemo(() => profileData.profile?.user.bio?.trim() || '', [profileData.profile]);

    const ratingText = useMemo(() => {
        const user = profileData.profile?.user;

        if (!user || user.rating === null || user.rating === undefined) {
            return '';
        }

        return localization.t('publicProfile.rating', { rating: user.rating });
    }, [profileData.profile]);

    const countryRankText = useMemo(() => {
        const rank = profileData.profile?.user.rankInCountry;

        if (rank === null || rank === undefined) {
            return '';
        }

        return localization.t('publicProfile.rankInCountry', { rank });
    }, [profileData.profile]);

    const worldRankText = useMemo(() => {
        const rank = profileData.profile?.user.rankInWorld;

        if (rank === null || rank === undefined) {
            return '';
        }

        return localization.t('publicProfile.rankInWorld', { rank });
    }, [profileData.profile]);

    return {
        ...profileData,
        ...eventsData,
        ...tastingsData,
        ...offersData,
        ...shareData,
        activeTab,
        tabs,
        fullName,
        avatarUrl,
        bio,
        ratingText,
        countryRankText,
        worldRankText,
        isFollowDisabled: true,
        onPressBack,
        onFollowPress,
        onRefresh,
    };
};
