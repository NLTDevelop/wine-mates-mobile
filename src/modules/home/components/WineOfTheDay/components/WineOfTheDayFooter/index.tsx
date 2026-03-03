import { memo } from 'react';
import { WineReviewBlock } from '@/UIKit/WineReviewBlock';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';

interface IProps {
    wine: IWineListItem;
}

const WineOfTheDayFooterComponent = ({ wine }: IProps) => {
    const lastReviewData = wine.lastRate || wine.lastReview;
    
    if (!lastReviewData) return null;

    return <WineReviewBlock user={lastReviewData.user} review={lastReviewData.review} />;
};

export const WineOfTheDayFooter = memo(WineOfTheDayFooterComponent);
WineOfTheDayFooter.displayName = 'WineOfTheDayFooter';
