import { useCallback, useMemo } from 'react';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { useSelectablePressGuard } from '@/hooks/useSelectablePressGuard';

interface IProps {
    item: IWineListItem;
    onPress: (item: IWineListItem) => void;
    hideSimilarity?: boolean;
    showDate?: boolean;
}

export const useWineListItem = ({ item, onPress, hideSimilarity = false, showDate = false }: IProps) => {
    const { colors, locale } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const guard = useSelectablePressGuard();
    
    const handleItemPress = useCallback(() => guard.bindPressable.onPress(() => onPress(item)), [item, onPress, guard]);
    
    const similarityText = useMemo(() => {
        if (!item.similarity) return '-';
        return `${Math.round(item.similarity * 100)}%`;
    }, [item.similarity]);

    const displayRating = useMemo(() => {
        if (item.averageUserRating > 0) {
            return item.averageUserRating.toFixed(1);
        }
        if (item.averageExpertRating > 0) {
            return ((item.averageExpertRating / 100) * 5).toFixed(1);
        }
        return '-';
    }, [item.averageUserRating, item.averageExpertRating]);

    const lastReviewData = useMemo(() => {
        return item.lastRate || item.lastReview || null;
    }, [item.lastRate, item.lastReview]);

    const formattedDate = useMemo(() => {
        if (!lastReviewData?.createdAt) return null;
        
        const date = new Date(lastReviewData.createdAt);
        const isEnglish = locale === 'en';
        
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: isEnglish,
        };
        
        const formatted = new Intl.DateTimeFormat(isEnglish ? 'en-US' : 'uk-UA', options).format(date);
        return formatted;
    }, [lastReviewData?.createdAt, locale]);

    return {
        styles,
        guard,
        handleItemPress,
        similarityText,
        displayRating,
        lastReviewData,
        hideSimilarity,
        showDate,
        formattedDate,
    };
};
