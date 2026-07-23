import { useCallback, useMemo } from 'react';
import { GestureResponderEvent } from 'react-native';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useUiContext } from '@/UIProvider';
import { declOfWord } from '@/utils';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { useProfileNavigation } from '@/hooks/useProfileNavigation';

interface IProps {
    item: IWineListItem | IWineDetails;
    onPress?: (item: IWineListItem) => void;
    onSharePress?: (item: IWineListItem | IWineDetails) => void;
    hideSimilarity?: boolean;
    removeCardStyles?: boolean;
    isMyWine?: boolean;
    showTastingAuthor?: boolean;
}

const isWineListItem = (item: IWineListItem | IWineDetails): item is IWineListItem => {
    return !('currentVintage' in item);
};
const isWineDetails = (item: IWineListItem | IWineDetails): item is IWineDetails => 'currentVintage' in item;

export const useWineListItem = ({
    item,
    onPress,
    onSharePress,
    removeCardStyles,
    isMyWine,
    showTastingAuthor,
}: IProps) => {
    const { t } = useUiContext();
    const wineryUserId = isWineDetails(item) ? item.wineryUserId : null;
    const { onUserPressById } = useProfileNavigation();

    const onItemPress = useCallback(() => {
        if (onPress && isWineListItem(item)) {
            onPress(item);
        }
    }, [item, onPress]);

    const onShareItemPress = useCallback(() => {
        onSharePress?.(item);
    }, [item, onSharePress]);

    const onPressShareButton = useCallback((event: GestureResponderEvent) => {
        event.stopPropagation();
        onShareItemPress();
    }, [onShareItemPress]);

    const onWineryPress = useCallback(
        (event: GestureResponderEvent) => {
            event.stopPropagation();

            if (typeof wineryUserId !== 'number') {
                return;
            }

            onUserPressById(wineryUserId, WineExperienceLevelEnum.CREATOR);
        },
        [onUserPressById, wineryUserId],
    );

    const isWineryLink = typeof wineryUserId === 'number';

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

    const tastingAuthor = item.myReview?.user;
    const tastingAuthorFullName = useMemo(() => {
        if (!showTastingAuthor || !tastingAuthor) {
            return '';
        }

        return [tastingAuthor.firstName, tastingAuthor.lastName].filter(Boolean).join(' ').trim();
    }, [showTastingAuthor, tastingAuthor]);
    const isTastingAuthorExpert =
        showTastingAuthor && tastingAuthor?.wineExperienceLevel === WineExperienceLevelEnum.EXPERT;
    const isTastingAuthorLover =
        showTastingAuthor && tastingAuthor?.wineExperienceLevel === WineExperienceLevelEnum.LOVER;

    const showExpertReviewCount = useMemo(() => {
        if (isTastingAuthorExpert) {
            return false;
        }

        if (!isMyWine) {
            return true;
        }

        return isCurrentUserLover;
    }, [isCurrentUserLover, isMyWine, isTastingAuthorExpert]);

    const expertReviewLabel = useMemo(() => {
        if (isTastingAuthorExpert && tastingAuthorFullName) {
            return tastingAuthorFullName;
        }

        if (isMyWine && !isCurrentUserLover) {
            return t('wine.myReview');
        }

        return t('wine.expertReview');
    }, [isCurrentUserLover, isMyWine, isTastingAuthorExpert, t, tastingAuthorFullName]);

    const userReviewLabel = useMemo(() => {
        if (isTastingAuthorLover && tastingAuthorFullName) {
            return tastingAuthorFullName;
        }

        if (isMyWine && isCurrentUserLover) {
            return t('wine.myReview');
        }

        return `(${userReviewCount})`;
    }, [isCurrentUserLover, isMyWine, isTastingAuthorLover, t, tastingAuthorFullName, userReviewCount]);

    return {
        onItemPress,
        similarityText,
        userRating,
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
        showExpertReviewCount,
        expertReviewLabel,
        userReviewLabel,
        onPressShareButton,
        onWineryPress,
        isWineryLink,
    };
};
