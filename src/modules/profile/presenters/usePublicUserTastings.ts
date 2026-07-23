import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { userTastingsModel } from '@/entities/wine/models/UserTastingsModel';
import { userTastingsService } from '@/entities/wine/services/UserTastingsService';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { usePaginationRequestGuard } from '@/hooks/usePaginationRequestGuard';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

const LIMIT = 10;

export const usePublicUserTastings = (userId: number) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const list = userTastingsModel.list;
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { onTryStartPaginationRequest, onResetPaginationRequests } = usePaginationRequestGuard();

    const loadTastings = useCallback(
        async (offset: number) => {
            if (!userId) {
                setIsLoading(false);
                return;
            }

            try {
                if (offset === 0) {
                    setIsLoading(true);
                } else {
                    setIsLoadingMore(true);
                }

                const response = await userTastingsService.list({ userId, limit: LIMIT, offset });

                if (response.isError || !response.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                }
            } catch (error) {
                console.warn('usePublicUserTastings -> loadTastings: ', error);
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
        const frameId = requestAnimationFrame(() => {
            onResetPaginationRequests();
            loadTastings(0);
        });

        return () => {
            cancelAnimationFrame(frameId);
            userTastingsModel.list = null;
        };
    }, [loadTastings, onResetPaginationRequests]);

    const onRefreshTastings = useCallback(async () => {
        onResetPaginationRequests();
        await loadTastings(0);
    }, [loadTastings, onResetPaginationRequests]);

    const onLoadMoreTastings = useCallback(async () => {
        const currentList = userTastingsModel.list;
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

        await loadTastings(offset);
    }, [isLoading, isLoadingMore, loadTastings, onTryStartPaginationRequest]);

    const onTastingPress = useCallback(
        (item: IWineListItem) => {
            navigation.navigate('WineDetailsView', { wineId: item.id, vintages: 'All' });
        },
        [navigation],
    );

    return {
        tastings: list?.rows || [],
        isTastingsLoading: isLoading,
        isTastingsLoadingMore: isLoadingMore,
        onRefreshTastings,
        onLoadMoreTastings,
        onTastingPress,
    };
};
