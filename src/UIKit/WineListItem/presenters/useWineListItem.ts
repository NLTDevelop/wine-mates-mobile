import { useCallback, useMemo } from 'react';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useSelectablePressGuard } from '@/hooks/useSelectablePressGuard';
import { useUiContext } from '@/UIProvider';
import { declOfWord } from '@/utils';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';

interface IProps {
    item: IWineListItem | IWineDetails;
    onPress?: (item: IWineListItem) => void;
    hideSimilarity?: boolean;
    removeCardStyles?: boolean;
}

const isWineListItem = (item: IWineListItem | IWineDetails): item is IWineListItem => {
    return 'similarity' in item || 'myReview' in item || 'lastReview' in item || 'lastRate' in item
};
const isWineDetails = (item: IWineListItem | IWineDetails): item is IWineDetails => 'currentVintage' in item;

export const useWineListItem = ({ item, onPress, removeCardStyles }: IProps) => {
    const { t } = useUiContext();
    const guard = useSelectablePressGuard();

    const onItemPress = useCallback(() => {
        guard.bindPressable.onPress(() => {
            if (onPress && isWineListItem(item)) {
                onPress(item);
            }
        });
    }, [item, onPress, guard]);

    const similarityText = useMemo(() => {
        if (!isWineListItem(item) || !item.similarity) return '-';
        return `${Math.round(item.similarity * 100)}%`;
    }, [item]);

    const displayRating = useMemo(() => {
        if (item.averageUserRating > 0) {
            return item.averageUserRating.toFixed(1);
        } else {
            return '0';
        }
    }, [item.averageUserRating]);

    const lastReviewData = useMemo(() => {
        if (!isWineListItem(item)) return null;
        return item.myReview || item.lastReview || null;
    }, [item]);

    const userReviewCount = useMemo(() => {
        const totalReviews = item.countUserRating ?? 0;
        return declOfWord(totalReviews, t('scanner.reviewCount') as unknown as Array<string>);
    }, [item, t]);

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

    return {
        guard,
        onItemPress,
        similarityText,
        displayRating,
        userReviewCount,
        lastReviewData,
        getFormattedDate,
        locationText,
        expertReviewCount,
    };
};
