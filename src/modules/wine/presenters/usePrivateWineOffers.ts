import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { wineOfferService } from '@/entities/wine/services/WineOfferService';
import { IWineOffer, IWineOfferPriceRange } from '@/entities/wine/types/IWineOffer';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IPrivateOfferListItem } from '../types/IPrivateOfferListItem';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { usePaginationRequestGuard } from '@/hooks/usePaginationRequestGuard';

const LIMIT = 20;

type RouteParams = {
    wineId: number;
    wineDetails: IWineDetails;
};

type LoadMode = 'initial' | 'filter' | 'more';

const normalizePriceRange = (range: IWineOfferPriceRange): IWineOfferPriceRange => {
    return {
        minPrice: Number(range.minPrice),
        maxPrice: Number(range.maxPrice),
        currency: range.currency || '',
    };
};

export const usePrivateWineOffers = () => {
    const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
    const route = useRoute();
    const { wineId, wineDetails } = route.params as RouteParams;
    const [offers, setOffers] = useState<IWineOffer[]>([]);
    const [offersCount, setOffersCount] = useState(0);
    const [priceRange, setPriceRange] = useState<IWineOfferPriceRange | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [draftMinPrice, setDraftMinPrice] = useState(0);
    const [draftMaxPrice, setDraftMaxPrice] = useState(0);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const { onTryStartPaginationRequest, onResetPaginationRequests } = usePaginationRequestGuard();

    const loadInitialData = useCallback(async () => {
        setIsLoading(true);

        try {
            const [offersResponse, priceRangeResponse] = await Promise.all([
                wineOfferService.getUserOffers({ wineId, offset: 0, limit: LIMIT }),
                wineOfferService.getPriceRange(wineId),
            ]);

            if (
                offersResponse.isError ||
                !offersResponse.data ||
                priceRangeResponse.isError ||
                !priceRangeResponse.data
            ) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    offersResponse.message || priceRangeResponse.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            const normalizedRange = normalizePriceRange(priceRangeResponse.data);
            setOffers(offersResponse.data.rows);
            setOffersCount(offersResponse.data.count);
            setPriceRange(normalizedRange);
            setMinPrice(normalizedRange.minPrice);
            setMaxPrice(normalizedRange.maxPrice);
            setDraftMinPrice(normalizedRange.minPrice);
            setDraftMaxPrice(normalizedRange.maxPrice);
        } catch (error) {
            console.warn('usePrivateWineOffers -> loadInitialData: ', error);
            toastService.showError(localization.t('common.errorHappened'), localization.t('common.somethingWentWrong'));
        } finally {
            setIsLoading(false);
        }
    }, [wineId]);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            onResetPaginationRequests();
            loadInitialData();
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [loadInitialData, onResetPaginationRequests]);

    const loadOffers = useCallback(
        async (offset: number, nextMinPrice: number, nextMaxPrice: number, mode: LoadMode) => {
            if (!priceRange || (mode === 'more' && isLoadingMore)) {
                return;
            }

            if (mode === 'more') {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            try {
                const response = await wineOfferService.getUserOffers({
                    wineId,
                    offset,
                    limit: LIMIT,
                    minPrice: nextMinPrice === priceRange.minPrice ? undefined : nextMinPrice,
                    maxPrice: nextMaxPrice === priceRange.maxPrice ? undefined : nextMaxPrice,
                });

                if (response.isError || !response.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }

                const responseData = response.data;
                setOffers(current => (mode === 'more' ? [...current, ...responseData.rows] : responseData.rows));
                setOffersCount(responseData.count);
            } catch (error) {
                console.warn('usePrivateWineOffers -> loadOffers: ', error);
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        [isLoadingMore, priceRange, wineId],
    );

    const onOpenFilter = useCallback(() => {
        if (!priceRange) {
            return;
        }

        setDraftMinPrice(minPrice);
        setDraftMaxPrice(maxPrice);
        setIsFilterVisible(true);
    }, [maxPrice, minPrice, priceRange]);

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
        onResetPaginationRequests();
        loadOffers(0, draftMinPrice, draftMaxPrice, 'filter');
    }, [draftMaxPrice, draftMinPrice, loadOffers, onResetPaginationRequests]);

    const onEndReached = useCallback(() => {
        if (isLoading || isLoadingMore || offers.length >= offersCount || !onTryStartPaginationRequest(offers.length)) {
            return;
        }

        loadOffers(offers.length, minPrice, maxPrice, 'more');
    }, [
        isLoading,
        isLoadingMore,
        loadOffers,
        maxPrice,
        minPrice,
        offers.length,
        offersCount,
        onTryStartPaginationRequest,
    ]);

    const createOnUserPress = useCallback(
        (userId: number) => {
            return () => {
                navigation.navigate('PublicUserProfileView', { userId });
            };
        },
        [navigation],
    );

    const items = useMemo<IPrivateOfferListItem[]>(() => {
        return offers.reduce<IPrivateOfferListItem[]>((result, offer) => {
            if (!offer.user) {
                return result;
            }

            result.push({
                id: offer.id,
                fullName: `${offer.user.firstName} ${offer.user.lastName}`.trim(),
                avatarUrl:
                    offer.user.avatar?.smallUrl ||
                    offer.user.avatar?.mediumUrl ||
                    offer.user.avatar?.originalUrl ||
                    null,
                priceText: `${offer.price} ${offer.currency}`,
                onPress: createOnUserPress(offer.user.id),
            });

            return result;
        }, []);
    }, [createOnUserPress, offers]);

    const onVintageChange = useCallback((_item: IDropdownItem) => undefined, []);
    const onFavoritePress = useCallback(() => undefined, []);

    return {
        wineDetails,
        items,
        isLoading,
        isLoadingMore,
        isFilterVisible,
        draftMinPrice,
        draftMaxPrice,
        priceMin: priceRange?.minPrice || 0,
        priceMax: priceRange?.maxPrice || 0,
        priceCurrency: priceRange?.currency || '',
        filterCount: priceRange && (minPrice !== priceRange.minPrice || maxPrice !== priceRange.maxPrice) ? 1 : 0,
        onOpenFilter,
        onCloseFilter,
        onPriceRangeChange,
        onApplyFilter,
        onEndReached,
        onVintageChange,
        onFavoritePress,
    };
};
