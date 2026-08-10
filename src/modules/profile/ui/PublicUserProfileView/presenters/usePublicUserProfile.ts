import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { wineOfferService } from '@/entities/wine/services/WineOfferService';
import { IPrivateOfferListItem } from '@/modules/wine/types/IPrivateOfferListItem';

type RouteList = {
    PublicUserProfileView: IPublicProfileRouteParams;
};

export const usePublicUserProfile = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<RouteProp<RouteList, 'PublicUserProfileView'>>();
    const userId = route.params?.userId;
    const wineId = route.params?.wineId;
    const vintages = route.params?.vintages;
    const hasWineOffersContext = Boolean(wineId && route.params?.initialTab === PublicProfileTab.WINES);
    const [activeTab, setActiveTab] = useState(route.params?.initialTab ?? PublicProfileTab.EVENTS);
    const [offers, setOffers] = useState<IPrivateOfferListItem[]>([]);
    const [isOffersLoading, setIsOffersLoading] = useState(hasWineOffersContext);
    const profileData = usePublicProfileData(userId, 'user');
    const eventsData = usePublicProfileEvents(userId);
    const tastingsData = usePublicUserTastings(userId);
    const shareData = useWineShareModal();

    const onOfferPress = useCallback(() => undefined, []);

    const loadOffers = useCallback(async () => {
        if (!hasWineOffersContext || !wineId || !userId) {
            setOffers([]);
            setIsOffersLoading(false);
            return;
        }

        setIsOffersLoading(true);

        try {
            const response = await wineOfferService.getUserOffers({ wineId, vintages, offset: 0, limit: 100 });

            if (response.isError || !response.data) {
                setOffers([]);
                return;
            }

            const sellerOffers = response.data.rows.filter(offer => offer.user?.id === userId);
            setOffers(
                sellerOffers.reduce<IPrivateOfferListItem[]>((result, offer) => {
                    if (!offer.user) {
                        return result;
                    }

                    result.push({
                        id: offer.id,
                        fullName: `${offer.user.firstName} ${offer.user.lastName}`.trim(),
                        avatarUrl:
                            offer.user.avatar?.smallUrl ||
                            offer.user.avatar?.mediumUrl ||
                            offer.user.avatar?.originalUrl ||
                            null,
                        priceText: `${offer.price} ${offer.currency}`,
                        onPress: onOfferPress,
                    });

                    return result;
                }, []),
            );
        } finally {
            setIsOffersLoading(false);
        }
    }, [hasWineOffersContext, onOfferPress, userId, vintages, wineId]);

    useEffect(() => {
        loadOffers();
    }, [loadOffers]);

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

    const tabs = useMemo<IPublicProfileTabItem[]>(() => {
        const thirdTab = hasWineOffersContext
            ? {
                  key: PublicProfileTab.WINES,
                  title: localization.t('publicProfile.offers'),
                  isSelected: activeTab === PublicProfileTab.WINES,
                  isDisabled: false,
                  onPress: onWinesPress,
              }
            : {
                  key: PublicProfileTab.TASTINGS,
                  title: localization.t('publicProfile.tastings'),
                  isSelected: activeTab === PublicProfileTab.TASTINGS,
                  isDisabled: false,
                  onPress: onTastingsPress,
              };

        return [
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
            thirdTab,
        ];
    }, [activeTab, hasWineOffersContext, onActivityPress, onEventsPress, onTastingsPress, onWinesPress]);

    const onRefresh = useCallback(async () => {
        const requests = [profileData.loadProfile()];

        if (activeTab === PublicProfileTab.EVENTS) {
            requests.push(eventsData.onRefreshEvents());
        } else if (activeTab === PublicProfileTab.TASTINGS) {
            requests.push(tastingsData.onRefreshTastings());
        } else if (activeTab === PublicProfileTab.WINES) {
            requests.push(loadOffers());
        }

        await Promise.all(requests);
    }, [activeTab, eventsData, loadOffers, profileData, tastingsData]);

    const fullName = useMemo(() => {
        return `${profileData.profile?.user.firstName || ''} ${profileData.profile?.user.lastName || ''}`.trim();
    }, [profileData.profile]);

    const avatarUrl = useMemo(() => {
        const avatar = profileData.profile?.user.avatar;
        return avatar?.mediumUrl || avatar?.originalUrl || avatar?.smallUrl || null;
    }, [profileData.profile]);

    const bio = useMemo(() => profileData.profile?.user.bio?.trim() || '', [profileData.profile]);

    return {
        ...profileData,
        ...eventsData,
        ...tastingsData,
        ...shareData,
        activeTab,
        tabs,
        offers,
        isOffersLoading,
        fullName,
        avatarUrl,
        bio,
        isFollowDisabled: true,
        onPressBack,
        onFollowPress,
        onRefresh,
    };
};
