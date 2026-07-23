import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { IUserTastingListItem } from '@/entities/wine/types/IUserTastingsList';
import { WineListItem } from '@/UIKit/WineListItem';
import { WineReviewBlock } from '@/UIKit/WineReviewBlock';

interface IProps {
    item: IUserTastingListItem;
    onPress: (item: IWineListItem) => void;
    onSharePress: (item: IWineListItem | IWineDetails) => void;
}

export const PublicUserTastingListItem = ({ item, onPress, onSharePress }: IProps) => {
    return (
        <WineListItem
            item={item}
            onPress={onPress}
            onSharePress={onSharePress}
            footer={
                <WineReviewBlock
                    user={item.myReview.user}
                    review={item.myReview.review}
                    showWithoutPremium
                />
            }
            showDate
            showVintage
            showNonVintage
            showTastingAuthor
        />
    );
};
