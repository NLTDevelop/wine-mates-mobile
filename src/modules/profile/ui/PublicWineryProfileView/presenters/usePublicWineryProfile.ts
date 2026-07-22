import { useCallback, useMemo, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PublicProfileTab } from '@/modules/profile/enums/PublicProfileTab';
import { IPublicProfileRouteParams } from '@/modules/profile/types/IPublicProfileRouteParams';
import { IPublicProfileTabItem } from '@/modules/profile/types/IPublicProfileTabItem';
import { WineryStatusEnum } from '@/entities/winery/enums/WineryStatusEnum';
import { IGalleryPhoto } from '@/UIKit/Gallery/types/IGalleryPhoto';
import { useGallery } from '@/UIKit/Gallery/presenters/useGallery';
import { usePublicProfileData } from '@/modules/profile/presenters/usePublicProfileData';
import { usePublicProfileEvents } from '@/modules/profile/presenters/usePublicProfileEvents';
import { usePublicWineryWines } from '@/modules/profile/presenters/usePublicWineryWines';
import { useWineShareModal } from '@/UIKit/WineShareModal/presenters/useWineShareModal';
import { localization } from '@/UIProvider/localization/Localization';

type RouteList = {
    PublicWineryProfileView: IPublicProfileRouteParams;
};

export const usePublicWineryProfile = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<RouteProp<RouteList, 'PublicWineryProfileView'>>();
    const userId = route.params?.userId;
    const [activeTab, setActiveTab] = useState(PublicProfileTab.DESCRIPTION);
    const profileData = usePublicProfileData(userId, 'winery');
    const eventsData = usePublicProfileEvents(userId);
    const winesData = usePublicWineryWines(profileData.profile?.winery?.id);
    const shareData = useWineShareModal();

    const onPressBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onDescriptionPress = useCallback(() => {
        setActiveTab(PublicProfileTab.DESCRIPTION);
    }, []);

    const onActivityPress = useCallback(() => undefined, []);

    const onEventsPress = useCallback(() => {
        setActiveTab(PublicProfileTab.EVENTS);
    }, []);

    const onWinesPress = useCallback(() => {
        setActiveTab(PublicProfileTab.WINES);
    }, []);

    const tabs = useMemo<IPublicProfileTabItem[]>(
        () => [
            {
                key: PublicProfileTab.DESCRIPTION,
                title: localization.t('publicProfile.description'),
                isSelected: activeTab === PublicProfileTab.DESCRIPTION,
                isDisabled: false,
                onPress: onDescriptionPress,
            },
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
                key: PublicProfileTab.WINES,
                title: localization.t('publicProfile.wines'),
                isSelected: activeTab === PublicProfileTab.WINES,
                isDisabled: false,
                onPress: onWinesPress,
            },
        ],
        [activeTab, onActivityPress, onDescriptionPress, onEventsPress, onWinesPress],
    );

    const onRefresh = useCallback(async () => {
        const requests: Promise<void>[] = [profileData.loadProfile()];

        if (activeTab === PublicProfileTab.EVENTS) {
            requests.push(eventsData.onRefreshEvents());
        } else if (activeTab === PublicProfileTab.WINES) {
            requests.push(winesData.onRefreshWines());
        }

        await Promise.all(requests);
    }, [activeTab, eventsData, profileData, winesData]);

    const winery = profileData.profile?.winery;
    const wineryDetails = useMemo(() => {
        if (!winery) {
            return '';
        }

        const foundedYear = winery.foundedYear
            ? localization.t('publicProfile.foundedYear', { year: winery.foundedYear })
            : '';
        const location = [winery.region?.name, winery.country?.name].filter(Boolean).join(', ');

        return [foundedYear, location].filter(Boolean).join('\n');
    }, [winery]);

    const mainPhotoUrl = useMemo(() => {
        return winery?.mainPhoto?.originalUrl || winery?.mainPhoto?.mediumUrl || winery?.mainPhoto?.smallUrl || null;
    }, [winery]);

    const galleryPhotos = useMemo<IGalleryPhoto[]>(() => {
        return (winery?.gallery || [])
            .map((media, index) => ({
                id: `${media.id || index}-${media.name}`,
                uri: media.originalUrl || media.mediumUrl || media.smallUrl,
            }))
            .filter(item => Boolean(item.uri));
    }, [winery]);
    const gallery = useGallery({ photos: galleryPhotos });
    const isWineryVerified = winery?.application?.status === WineryStatusEnum.APPROVED;
    const wineryStatusLabel = winery
        ? localization.t(isWineryVerified ? 'publicProfile.verified' : 'publicProfile.notVerified')
        : '';

    return {
        ...profileData,
        ...eventsData,
        ...winesData,
        ...shareData,
        activeTab,
        tabs,
        wineryName: winery?.name || '',
        wineryDetails,
        wineryDescription: winery?.description || '',
        gallery,
        isWineryVerified,
        wineryStatusLabel,
        mainPhotoUrl,
        onPressBack,
        onRefresh,
    };
};
