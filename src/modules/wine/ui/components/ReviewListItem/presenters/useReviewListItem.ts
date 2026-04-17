import { formatRelativeDate, isLessThanMinuteFromNow } from '@/utils';
import { IWineReviewsListItem } from '@/entities/wine/types/IWineReviewsListItem';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { userModel } from '@/entities/users/UserModel';

interface IProps {
    item: IWineReviewsListItem;
    locale: string;
}

export const useReviewListItem = ({ item, locale }: IProps) => {
    const isJustNow = isLessThanMinuteFromNow(item.createdAt);
    const formattedDate = formatRelativeDate(item.createdAt, locale);
    const isPremiumUser = userModel.user?.hasPremium || false;
    const isMyReview = item.user.id === userModel.user?.id;
    const isLocked = !isMyReview && item.user.wineExperienceLevel !== WineExperienceLevelEnum.LOVER && !isPremiumUser;
    const isLoverLevel = item.user.wineExperienceLevel === WineExperienceLevelEnum.LOVER;

    const formattedUserRating = (item.userRating || 0).toFixed(1);
    const formattedExpertRating = (item.expertRating || 0).toFixed(1);

    return {
        isJustNow,
        formattedDate,
        isLocked,
        isLoverLevel,
        formattedUserRating,
        formattedExpertRating,
    };
};
