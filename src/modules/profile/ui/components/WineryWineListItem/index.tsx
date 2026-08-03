import { memo, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWineryLinkedWineOffer } from '@/entities/winery/types/IWineryLinkedWine';
import { useUiContext } from '@/UIProvider';
import { WineListItem } from '@/UIKit/WineListItem';
import { WineReviewBlock } from '@/UIKit/WineReviewBlock';
import { Typography } from '@/UIKit/Typography';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { useWineryWineListItem } from './presenters/useWineryWineListItem';
import { getStyles } from './styles';

interface IProps {
    item: IWineListItem;
    onPress: (item: IWineListItem) => void;
    onSharePress: (item: IWineListItem | IWineDetails) => void;
    offer?: IWineryLinkedWineOffer | null;
    onOfferPress?: (item: IWineListItem, offer: IWineryLinkedWineOffer | null) => void;
    showExpertRatingWithoutPremium?: boolean;
}

const WineryWineListItemComponent = ({
    item,
    onPress,
    onSharePress,
    offer = null,
    onOfferPress,
    showExpertRatingWithoutPremium = true,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isOfferBlockVisible, isOfferActionDisabled, hasReview, priceText, onPricePress } = useWineryWineListItem({
        item,
        offer,
        onOfferPress,
    });
    const review = item.lastReview;
    const reviewBlock = review && hasReview
        ? <WineReviewBlock user={review.user} review={review.review} showWithoutPremium />
        : null;
    const offerBlock = isOfferBlockVisible ? (
        <TouchableOpacity
            onPress={onPricePress}
            disabled={isOfferActionDisabled}
            style={offer ? styles.priceContainer : styles.addPriceContainer}
        >
            <Typography
                variant={offer ? 'h4' : 'body_500'}
                text={priceText}
                style={offer ? styles.priceText : styles.addPriceText}
            />
            {!offer ? <PlusIcon color={colors.primary} /> : null}
        </TouchableOpacity>
    ) : null;

    return (
        <WineListItem
            item={item}
            onPress={onPress}
            onSharePress={onSharePress}
            detailsFooter={offerBlock}
            footer={reviewBlock}
            showExpertRatingWithoutPremium={showExpertRatingWithoutPremium}
            alignFooterToBottom
        />
    );
};

export const WineryWineListItem = memo(WineryWineListItemComponent);
WineryWineListItem.displayName = 'WineryWineListItem';
