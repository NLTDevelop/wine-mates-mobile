import { useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { ICarouselWineCardData } from './types';
import { userModel } from '@/entities/users/UserModel';
import { declOfWord } from '@/utils';

interface IProps {
    item: ICarouselWineCardData;
}

export const useCarouselWineCard = ({ item }: IProps) => {
    const { t } = useUiContext();

    const hasPremium = userModel.user?.hasPremium;

    const displayRating = useMemo(() => {
        if (item.averageUserRating > 0) {
            return item.averageUserRating.toFixed(1);
        }
        return '-';
    }, [item.averageUserRating]);

    const ratingCount = useMemo(() => {
        return declOfWord(item.countUserRating || 0, t('scanner.reviewCount') as unknown as Array<string>);
    }, [item.countUserRating, t]);

    const lastReviewData = useMemo(() => {
        return item.lastReview || null;
    }, [item.lastReview]);

    const showMedal = useMemo(() => {
        return item.averageExpertRating && item.averageExpertRating > 0;
    }, [item.averageExpertRating]);

    const medalLabel = useMemo(() => {
        if (!item.averageExpertRating) return '';

        const rating = item.averageExpertRating;
        if (rating >= 97) return t('medal.platinum');
        if (rating >= 94) return t('medal.gold');
        if (rating >= 90) return t('medal.silver');
        if (rating >= 86) return t('medal.bronze');
        if (rating >= 80) return t('medal.nice');
        if (rating >= 75) return t('medal.simple');
        return t('medal.weak');
    }, [item.averageExpertRating, t]);

    return {
        hasPremium,
        displayRating,
        ratingCount,
        lastReviewData,
        showMedal,
        medalLabel,
    };
};
