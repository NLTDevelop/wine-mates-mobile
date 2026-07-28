import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { wineMarketplaceService } from '@/entities/wine/services/WineMarketplaceService';
import { IWinePrivateOffer } from '@/entities/wine/types/IWinePrivateOffer';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IPrivateOfferListItem } from '../types/IPrivateOfferListItem';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';

const PRICE_MIN = 0;
const PRICE_MAX = 1000;

type RouteParams = {
    wineId: number;
    wineDetails: IWineDetails;
};

export const usePrivateWineOffers = () => {
    const route = useRoute();
    const { wineId, wineDetails } = route.params as RouteParams;
    const [offers, setOffers] = useState<IWinePrivateOffer[]>([]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [draftMinPrice, setDraftMinPrice] = useState(PRICE_MIN);
    const [draftMaxPrice, setDraftMaxPrice] = useState(PRICE_MAX);
    const [minPrice, setMinPrice] = useState(PRICE_MIN);
    const [maxPrice, setMaxPrice] = useState(PRICE_MAX);

    useEffect(() => {
        const params = {
            minPrice: minPrice === PRICE_MIN ? undefined : minPrice,
            maxPrice: maxPrice === PRICE_MAX ? undefined : maxPrice,
        };
        wineMarketplaceService.getPrivateOffers(wineId, params).then(response => {
            if (!response.isError && response.data) {
                setOffers(response.data);
            }
        });
    }, [maxPrice, minPrice, wineId]);

    const items = useMemo<IPrivateOfferListItem[]>(() => {
        return offers.map(offer => ({
            id: offer.id,
            fullName: `${offer.seller.firstName} ${offer.seller.lastName}`,
            avatarUrl: offer.seller.avatar?.smallUrl || offer.seller.avatar?.mediumUrl || null,
            priceText: `${offer.price} ${offer.currency}`,
        }));
    }, [offers]);

    const onOpenFilter = useCallback(() => {
        setDraftMinPrice(minPrice);
        setDraftMaxPrice(maxPrice);
        setIsFilterVisible(true);
    }, [maxPrice, minPrice]);

    const onCloseFilter = useCallback(() => {
        setIsFilterVisible(false);
    }, []);

    const onPriceRangeChange = useCallback((nextMin: number, nextMax: number) => {
        setDraftMinPrice(nextMin);
        setDraftMaxPrice(nextMax);
    }, []);

    const onApplyFilter = useCallback(() => {
        setMinPrice(draftMinPrice);
        setMaxPrice(draftMaxPrice);
        setIsFilterVisible(false);
    }, [draftMaxPrice, draftMinPrice]);

    const onVintageChange = useCallback((_item: IDropdownItem) => undefined, []);
    const onFavoritePress = useCallback(() => undefined, []);

    return {
        wineDetails,
        items,
        isFilterVisible,
        draftMinPrice,
        draftMaxPrice,
        priceMin: PRICE_MIN,
        priceMax: PRICE_MAX,
        filterCount: minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX ? 1 : 0,
        onOpenFilter,
        onCloseFilter,
        onPriceRangeChange,
        onApplyFilter,
        onVintageChange,
        onFavoritePress,
    };
};
