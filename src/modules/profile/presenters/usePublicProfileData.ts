import { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking } from 'react-native';
import { IPublicProfile } from '@/entities/users/types/IPublicProfile';
import { userService } from '@/entities/users/UserService';
import { getContactTitle, getContactType, getContactUrl } from '@/entities/contacts/presenters/useContactType';
import { IPublicProfileLinkItem } from '@/modules/profile/types/IPublicProfileLinkItem';
import { localization } from '@/UIProvider/localization/Localization';
import { toastService } from '@/libs/toast/toastService';
import { IGalleryPhoto } from '@/UIKit/Gallery/types/IGalleryPhoto';
import { useGallery } from '@/UIKit/Gallery/presenters/useGallery';

type LinkSource = 'user' | 'winery';

export const usePublicProfileData = (userId: number, linkSource: LinkSource) => {
    const [profile, setProfile] = useState<IPublicProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isLinksModalVisible, setIsLinksModalVisible] = useState(false);

    const loadProfile = useCallback(async () => {
        if (!userId) {
            setIsError(true);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setIsError(false);
            const response = await userService.getPublicProfile(userId);

            if (response.isError || !response.data) {
                setIsError(true);
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            setProfile(response.data);
        } catch (error) {
            console.warn('usePublicProfileData -> loadProfile: ', error);
            setIsError(true);
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            loadProfile();
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [loadProfile]);

    const onOpenLink = useCallback(async (url: string) => {
        const contactType = getContactType('', url);
        const targetUrl = getContactUrl(url, contactType);

        try {
            const canOpen = await Linking.canOpenURL(targetUrl);

            if (!canOpen) {
                throw new Error(`Cannot open public profile link: ${targetUrl}`);
            }

            await Linking.openURL(targetUrl);
        } catch (error) {
            console.warn('usePublicProfileData -> onOpenLink: ', error);
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        }
    }, []);

    const rawLinks = useMemo(() => {
        if (!profile) {
            return [];
        }

        if (linkSource === 'winery') {
            return profile.winery?.links || [];
        }

        const userLinks = [...(profile.user.links || []), profile.user.website, profile.user.instagramLink].filter(
            (item): item is string => Boolean(item),
        );

        return Array.from(new Set(userLinks));
    }, [linkSource, profile]);

    const linkItems = useMemo<IPublicProfileLinkItem[]>(() => {
        return rawLinks.map((url, index) => {
            const contactType = getContactType('', url);

            return {
                id: `${index}-${url}`,
                title: getContactTitle('', url, contactType) || url,
                contactType,
                onPress: () => onOpenLink(url),
            };
        });
    }, [onOpenLink, rawLinks]);

    const profileGalleryData = useMemo(() => {
        const avatar = linkSource === 'winery' ? profile?.winery?.mainPhoto : profile?.user.avatar;
        const gallery = linkSource === 'winery' ? profile?.winery?.gallery || [] : profile?.user.gallery || [];
        const galleryPhotos = gallery.reduce<IGalleryPhoto[]>((items, media, index) => {
            const uri = media.originalUrl || media.mediumUrl || media.smallUrl;

            if (uri) {
                items.push({
                    id: `public-profile-gallery-${media.id || media.name || index}`,
                    uri,
                });
            }

            return items;
        }, []);
        const avatarUri = avatar?.originalUrl || avatar?.mediumUrl || avatar?.smallUrl;
        const photos = avatarUri
            ? [{ id: `public-profile-avatar-${avatar?.id || avatar?.name || userId}`, uri: avatarUri }, ...galleryPhotos]
            : galleryPhotos;

        return {
            photos,
            galleryCount: galleryPhotos.length,
        };
    }, [linkSource, profile, userId]);
    const profileGallery = useGallery({ photos: profileGalleryData.photos });
    const galleryBadgeText = profileGalleryData.galleryCount > 0 ? `+${profileGalleryData.galleryCount}` : '';
    const onAvatarPress = profileGallery.items[0]?.onPress;

    const onShowLinksModal = useCallback(() => {
        setIsLinksModalVisible(true);
    }, []);

    const onHideLinksModal = useCallback(() => {
        setIsLinksModalVisible(false);
    }, []);

    const hasLinks = linkItems.length > 0;

    return {
        profile,
        linkItems,
        hasLinks,
        profileGallery,
        galleryBadgeText,
        onAvatarPress,
        isLoading,
        isError,
        isLinksModalVisible,
        loadProfile,
        onShowLinksModal,
        onHideLinksModal,
    };
};
