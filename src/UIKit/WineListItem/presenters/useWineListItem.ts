import { useCallback, useMemo } from 'react';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useUiContext } from '@/UIProvider';
import { declOfWord } from '@/utils';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { createWineDeepLink } from '@/navigation/rootNavigator/linking';
import { prepareWineShareMessage } from '@/modules/wine/utils/prepareWineShareMessage';
import { shareWine } from '@/modules/wine/utils/shareWine';
import { toastService } from '@/libs/toast/toastService';

interface IProps {
    item: IWineListItem | IWineDetails;
    onPress?: (item: IWineListItem) => void;
    hideSimilarity?: boolean;
    removeCardStyles?: boolean;
    isMyWine?: boolean;
}

const isWineListItem = (item: IWineListItem | IWineDetails): item is IWineListItem => {
    return 'similarity' in item || 'myReview' in item || 'lastReview' in item || 'lastRate' in item
};
const isWineDetails = (item: IWineListItem | IWineDetails): item is IWineDetails => 'currentVintage' in item;

const getWineTitle = (item: IWineListItem | IWineDetails) => {
    const parts = [item.producer, item.name, item.vintage ? `${item.vintage}` : null].filter(Boolean);

    if (parts.length) {
        return parts.join(' ');
    }

    return `Wine #${item.id}`;
};

export const useWineListItem = ({ item, onPress, removeCardStyles, isMyWine }: IProps) => {
    const { t } = useUiContext();

    const onItemPress = useCallback(() => {
        if (onPress && isWineListItem(item)) {
            onPress(item);
        }
    }, [item, onPress]);

    const similarityText = useMemo(() => {
        if (!isWineListItem(item) || !item.similarity) return '-';
        return `${Math.round(item.similarity * 100)}%`;
    }, [item]);

    const userRating = useMemo(() => {
        const currentVintageUserRating = isWineDetails(item) && typeof item.currentVintage === 'object' && item.currentVintage !== null
            ? item.currentVintage.averageUserRating
            : null;
        const rating = removeCardStyles && currentVintageUserRating !== null ? currentVintageUserRating : item.averageUserRating;

        if (rating === null || rating === undefined) {
            return null;
        }
        
        return rating.toFixed(1);
    }, [item, removeCardStyles]);

    const lastReviewData = useMemo(() => {
        if (!isWineListItem(item)) return null;
        return item.myReview || item.lastReview || null;
    }, [item]);

    const userReviewCount = useMemo(() => {
        const currentVintageUserReviews = isWineDetails(item) && typeof item.currentVintage === 'object' && item.currentVintage !== null
            ? item.currentVintage.countUserRating
            : 0;
        const totalReviews = removeCardStyles && currentVintageUserReviews ? currentVintageUserReviews : item.countUserRating ?? 0;
        return declOfWord(totalReviews, t('scanner.reviewCount') as unknown as Array<string>);
    }, [item, removeCardStyles, t]);

    const expertReviewCount = useMemo(() => {
        const currentVintageExpertReviews = isWineDetails(item) && typeof item.currentVintage === 'object' && item.currentVintage !== null
            ? item.currentVintage.countExpertRating
            : 0;
        const totalReviews = removeCardStyles && currentVintageExpertReviews ? currentVintageExpertReviews : item.countExpertRating ?? 0;
        return declOfWord(totalReviews, t('scanner.reviewCount') as unknown as Array<string>);
    }, [item, removeCardStyles, t]);

    const locationText = useMemo(() => {
        const parts: string[] = [];
        if (item.country?.name) {
            parts.push(item.country.name);
        }
        if (item.region?.name) {
            parts.push(item.region.name);
        }
        return parts.length > 0 ? parts.join(', ') : null;
    }, [item.country, item.region]);

    const getFormattedDate = useCallback((createdAt: string, locale: string) => {
        const date = new Date(createdAt);
        const isEnglish = locale === 'en';

        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: isEnglish,
        };

        return new Intl.DateTimeFormat(isEnglish ? 'en-US' : 'uk-UA', options).format(date);
    }, []);

    const hasPremium = useMemo(() => userModel.user?.hasPremium ?? false, []);

    const userId = useMemo(() => userModel.user?.id ?? null, []);
    const currentUserWineExperienceLevel = userModel.user?.wineExperienceLevel;

    const shouldReviewShow = useMemo(() => {
        if (!isWineListItem(item)) return false;
        return !!item.myReview && (item.averageExpertRating && item.averageExpertRating >= 70);
    }, [item]);

    const currentVintageData = useMemo(() => {
        return isWineDetails(item) && typeof item.currentVintage === 'object' && item.currentVintage !== null
            ? item.currentVintage
            : null;
    }, [item]);

    const expertRating = useMemo(() => {
        const rating = removeCardStyles && currentVintageData
            ? currentVintageData?.averageExpertRating
            : item.averageExpertRating;

        return rating && rating >= 70 ? rating : null;
    }, [removeCardStyles, currentVintageData, item.averageExpertRating]);

    const showMedal = useMemo(() => {
        return shouldReviewShow || !!expertRating;
    }, [shouldReviewShow, expertRating]);

    const isCurrentUserLover = useMemo(() => {
        return currentUserWineExperienceLevel === WineExperienceLevelEnum.LOVER;
    }, [currentUserWineExperienceLevel]);

    const showExpertReviewCount = useMemo(() => {
        if (!isMyWine) {
            return true;
        }

        return isCurrentUserLover;
    }, [isCurrentUserLover, isMyWine]);

    const showUserReviewCount = useMemo(() => {
        if (!isMyWine) {
            return true;
        }

        return !isCurrentUserLover;
    }, [isCurrentUserLover, isMyWine]);

    const expertReviewLabel = useMemo(() => {
        if (isMyWine && !isCurrentUserLover) {
            return t('wine.myReview');
        }

        return t('wine.expertReview');
    }, [isCurrentUserLover, isMyWine, t]);

    const wineDeepLink = useMemo(() => {
        return createWineDeepLink(item.id);
    }, [item.id]);
    const wineImageUrl = item.image?.originalUrl || item.defaultImage?.originalUrl || null;

    const onSharePress = useCallback(async () => {
        try {
            const message = prepareWineShareMessage({
                intro: t('wine.shareWineIntro'),
                labels: {
                    title: t('wine.shareWineName'),
                    producer: t('wine.shareWineProducer'),
                    grapeVariety: t('wine.shareWineGrapeVariety'),
                    country: t('wine.country'),
                    region: t('wine.region'),
                    type: t('wine.typeOfWine'),
                },
                title: getWineTitle(item),
                producer: item.producer,
                grapeVariety: item.grapeVariety,
                country: item.country?.name,
                region: item.region?.name,
                type: item.type?.name,
                link: wineDeepLink,
            });

            await shareWine({
                filename: `wine-${item.id}`,
                imageUrl: wineImageUrl,
                message,
                title: t('wine.shareWineTitle'),
            });
        } catch (error) {
            console.warn('useWineListItem -> onSharePress: ', error);
            toastService.showError(t('common.errorHappened'), t('common.somethingWentWrong'));
        }
    }, [item, t, wineDeepLink, wineImageUrl]);

    return {
        onItemPress,
        similarityText,
        userRating,
        userReviewCount,
        lastReviewData,
        getFormattedDate,
        locationText,
        expertReviewCount,
        hasPremium,
        userId,
        shouldReviewShow,
        currentVintageData,
        expertRating,
        showMedal,
        showUserReviewCount,
        showExpertReviewCount,
        expertReviewLabel,
        onSharePress,
    };
};
