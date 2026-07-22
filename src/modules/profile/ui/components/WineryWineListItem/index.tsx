import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { WineListItem } from '@/UIKit/WineListItem';
import { WineReviewBlock } from '@/UIKit/WineReviewBlock';

interface IProps {
    item: IWineListItem;
    onPress: (item: IWineListItem) => void;
    onSharePress: (item: IWineListItem | IWineDetails) => void;
}

export const WineryWineListItem = ({ item, onPress, onSharePress }: IProps) => {
    const review = item.lastReview;
    const reviewBlock = review ? <WineReviewBlock user={review.user} review={review.review} /> : null;

    return (
        <WineListItem
            item={item}
            onPress={onPress}
            onSharePress={onSharePress}
            footer={reviewBlock}
            alignFooterToBottom
        />
    );
};
