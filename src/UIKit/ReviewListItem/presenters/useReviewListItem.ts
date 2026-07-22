import { IWineReviewsListItem } from '@/entities/wine/types/IWineReviewsListItem';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { userModel } from '@/entities/users/UserModel';
import { useProfileNavigation } from '@/hooks/useProfileNavigation';

interface IProps {
    item: IWineReviewsListItem;
    locale: string;
    showReviewWithoutPremium?: boolean;
}

const formatDateTime = (raw: string | number | Date, locale: string) => {
    if (!raw) return '';

    const parsedDate = new Date(raw);

    if (Number.isNaN(parsedDate.getTime())) return String(raw);

    return new Intl.DateTimeFormat(locale, {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(parsedDate);
};

export const useReviewListItem = ({ item, locale, showReviewWithoutPremium = false }: IProps) => {
    const { onUserPress } = useProfileNavigation(item.user.id, item.user.winery);
    const formattedDateTime = formatDateTime(item.createdAt, locale);
    const isPremiumUser = userModel.user?.hasPremium || false;
    const isMyReview = item.user.id === userModel.user?.id;
    const isLocked =
        !showReviewWithoutPremium &&
        !isMyReview &&
        item.user.wineExperienceLevel !== WineExperienceLevelEnum.LOVER &&
        !isPremiumUser;
    const isLoverLevel = item.user.wineExperienceLevel === WineExperienceLevelEnum.LOVER;

    const formattedUserRating = (item.userRating || 0).toFixed(1);
    const formattedExpertRating = (item.expertRating || 0).toFixed(1);

    return {
        formattedDateTime,
        isLocked,
        isLoverLevel,
        formattedUserRating,
        formattedExpertRating,
        onUserPress,
    };
};
