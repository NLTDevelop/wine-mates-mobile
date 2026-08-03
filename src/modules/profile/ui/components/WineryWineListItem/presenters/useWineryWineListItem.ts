import { useCallback, useMemo } from 'react';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { IWineryLinkedWineOffer } from '@/entities/winery/types/IWineryLinkedWine';
import { localization } from '@/UIProvider/localization/Localization';

interface IProps {
    item: IWineListItem;
    offer: IWineryLinkedWineOffer | null;
    onOfferPress?: (item: IWineListItem, offer: IWineryLinkedWineOffer | null) => void;
}

export const useWineryWineListItem = ({ item, offer, onOfferPress }: IProps) => {
    const onPricePress = useCallback(() => {
        onOfferPress?.(item, offer);
    }, [item, offer, onOfferPress]);

    return useMemo(() => {
        return {
            isOfferBlockVisible: Boolean(offer) || Boolean(onOfferPress),
            isOfferActionDisabled: !onOfferPress,
            hasReview: Boolean(item.lastReview?.review?.trim()),
            priceText: offer ? `${offer.price} ${offer.currency}` : localization.t('profile.setWinePrice'),
            onPricePress,
        };
    }, [item.lastReview?.review, offer, onOfferPress, onPricePress]);
};
