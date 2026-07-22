import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { wineryLinkedWinesModel } from '@/entities/winery/models/WineryLinkedWinesModel';
import { wineryWineService } from '@/entities/winery/services/WineryWineService';
import { localization } from '@/UIProvider/localization/Localization';
import { toastService } from '@/libs/toast/toastService';
import { usePaginationRequestGuard } from '@/hooks/usePaginationRequestGuard';

const LIMIT = 10;

export const usePublicWineryWines = (wineryId?: number) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const list = wineryLinkedWinesModel.list;
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { onTryStartPaginationRequest, onResetPaginationRequests } = usePaginationRequestGuard();

    const loadWines = useCallback(
        async (offset: number) => {
            if (!wineryId) {
                return;
            }

            try {
                if (offset === 0) {
                    setIsLoading(true);
                } else {
                    setIsLoadingMore(true);
                }

                const response = await wineryWineService.getLinkedWines({ wineryId, limit: LIMIT, offset });

                if (response.isError || !response.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                }
            } catch (error) {
                console.warn('usePublicWineryWines -> loadWines: ', error);
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        [wineryId],
    );

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            if (wineryId) {
                onResetPaginationRequests();
                loadWines(0);
            }
        });

        return () => {
            cancelAnimationFrame(frameId);
            wineryLinkedWinesModel.list = null;
        };
    }, [loadWines, onResetPaginationRequests, wineryId]);

    const onRefreshWines = useCallback(async () => {
        onResetPaginationRequests();
        await loadWines(0);
    }, [loadWines, onResetPaginationRequests]);

    const onLoadMoreWines = useCallback(async () => {
        const currentList = wineryLinkedWinesModel.list;

        const offset = currentList?.rows.length || 0;
        if (
            !currentList ||
            isLoading ||
            isLoadingMore ||
            offset >= currentList.count ||
            !onTryStartPaginationRequest(offset)
        ) {
            return;
        }

        await loadWines(offset);
    }, [isLoading, isLoadingMore, loadWines, onTryStartPaginationRequest]);

    const onWinePress = useCallback(
        (item: IWineListItem) => {
            navigation.navigate('WineDetailsView', { wineId: item.id });
        },
        [navigation],
    );

    return {
        wines: list?.rows || [],
        isWinesLoading: isLoading,
        isWinesLoadingMore: isLoadingMore,
        onRefreshWines,
        onLoadMoreWines,
        onWinePress,
    };
};
