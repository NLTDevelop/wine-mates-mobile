import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { wineOfferService } from '@/entities/wine/services/WineOfferService';
import { publicUserOffersModel } from '@/entities/wine/models/PublicUserOffersModel';
import { localization } from '@/UIProvider/localization/Localization';
import { toastService } from '@/libs/toast/toastService';
import { usePaginationRequestGuard } from '@/hooks/usePaginationRequestGuard';

const LIMIT = 10;

export const usePublicUserOffers = (userId: number | undefined, isEnabled: boolean) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const list = publicUserOffersModel.list;
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { onTryStartPaginationRequest, onResetPaginationRequests } = usePaginationRequestGuard();

    const loadOffers = useCallback(
        async (offset: number) => {
            if (!userId) {
                return;
            }

            try {
                if (offset === 0) {
                    setIsLoading(true);
                } else {
                    setIsLoadingMore(true);
                }

                const response = await wineOfferService.getUserProfileOffers({
                    userId,
                    limit: LIMIT,
                    offset,
                });

                if (response.isError || !response.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }
            } catch (error) {
                console.warn('usePublicUserOffers -> loadOffers: ', error);
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        [userId],
    );

    useEffect(() => {
        if (!isEnabled || !userId) {
            return undefined;
        }

        const frameId = requestAnimationFrame(() => {
            onResetPaginationRequests();
            loadOffers(0);
        });

        return () => {
            cancelAnimationFrame(frameId);
            publicUserOffersModel.list = null;
        };
    }, [isEnabled, loadOffers, onResetPaginationRequests, userId]);

    const onRefreshOffers = useCallback(async () => {
        onResetPaginationRequests();
        await loadOffers(0);
    }, [loadOffers, onResetPaginationRequests]);

    const onLoadMoreOffers = useCallback(async () => {
        const offset = list?.rows.length || 0;

        if (!list || isLoading || isLoadingMore || offset >= list.count || !onTryStartPaginationRequest(offset)) {
            return;
        }

        await loadOffers(offset);
    }, [isLoading, isLoadingMore, list, loadOffers, onTryStartPaginationRequest]);

    const onWinePress = useCallback(
        (item: IWineListItem) => {
            navigation.navigate('WineDetailsView', { wineId: item.id, vintages: 'All' });
        },
        [navigation],
    );

    return {
        offers: list?.rows || [],
        isOffersLoading: isLoading,
        isOffersLoadingMore: isLoadingMore,
        onRefreshOffers,
        onLoadMoreOffers,
        onWinePress,
    };
};
