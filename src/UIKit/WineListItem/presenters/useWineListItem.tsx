import { useCallback, useMemo } from 'react';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useSelectablePressGuard } from '@/hooks/useSelectablePressGuard';
import { useUiContext } from '@/UIProvider';
import { declOfWord } from '@/utils';

interface IProps {
    item: IWineListItem;
    onPress?: (item: IWineListItem) => void;
    hideSimilarity?: boolean;
    showDate?: boolean;
}

export const useWineListItem = ({ item, onPress }: IProps) => {
    const { t } = useUiContext();
    const guard = useSelectablePressGuard();

    const handleItemPress = useCallback(() => guard.bindPressable.onPress(() => onPress && onPress(item)), [item, onPress, guard]);

    const similarityText = useMemo(() => {
        if (!item.similarity) return '-';
        return `${Math.round(item.similarity * 100)}%`;
    }, [item.similarity]);

    const displayRating = useMemo(() => {
        if (item.averageUserRating > 0) {
            return item.averageUserRating.toFixed(1);
        }
        if (item.averageExpertRating && item.averageExpertRating > 0) {
            return ((item.averageExpertRating / 100) * 5).toFixed(1);
        }
        return '-';
    }, [item.averageUserRating, item.averageExpertRating]);

    const lastReviewData = useMemo(() => {
        return item.lastRate || item.lastReview || null;
    }, [item.lastRate, item.lastReview]);

    const reviewCount = useMemo(() => {
        return declOfWord(item.totalReviews || 0, t('scanner.reviewCount') as unknown as Array<string>);
    }, [item.totalReviews, t]);

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
        handleItemPress,
        similarityText,
        displayRating,
        reviewCount,
        lastReviewData,
        getFormattedDate,
        locationText,
    };
};
