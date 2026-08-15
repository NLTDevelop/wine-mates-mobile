import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IOfferedWineListItem } from '@/entities/wine/types/IOfferedWineListItem';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { wineryLinkedWinesModel } from '@/entities/winery/models/WineryLinkedWinesModel';
import { wineryWineService } from '@/entities/winery/services/WineryWineService';
import { localization } from '@/UIProvider/localization/Localization';
import { toastService } from '@/libs/toast/toastService';
import { usePaginationRequestGuard } from '@/hooks/usePaginationRequestGuard';
import { IWineListSearchQuery } from '@/modules/profile/types/IWineListSearchQuery';

const LIMIT = 10;

export const usePublicWineryWines = (wineryId: number | undefined, isEnabled: boolean) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const list = wineryLinkedWinesModel.list;
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasSearchCriteria, setHasSearchCriteria] = useState(false);
    const listRef = useRef<FlatList<IOfferedWineListItem>>(null);
    const searchQueryRef = useRef<IWineListSearchQuery>({ search: '' });
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

                const response = await wineryWineService.getLinkedWines({
                    wineryId,
                    limit: LIMIT,
                    offset,
                    ...searchQueryRef.current,
                });

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
        if (!isEnabled) {
            return undefined;
        }

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
    }, [isEnabled, loadWines, onResetPaginationRequests, wineryId]);

    const onRefreshWines = useCallback(async () => {
        onResetPaginationRequests();
        await loadWines(0);
    }, [loadWines, onResetPaginationRequests]);

    const scrollWinesToTop = useCallback(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    const onSearchWines = useCallback(async (query: IWineListSearchQuery) => {
        searchQueryRef.current = query;
        setHasSearchCriteria(Boolean(query.search.trim() || query.typeId || query.colorId));
        onResetPaginationRequests();
        await loadWines(0);
    }, [loadWines, onResetPaginationRequests]);

    const onResetWinesSearch = useCallback(() => {
        searchQueryRef.current = { search: '' };
        setHasSearchCriteria(false);
        onResetPaginationRequests();
    }, [onResetPaginationRequests]);

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
            navigation.navigate('WineDetailsView', { wineId: item.id, vintages: 'All' });
        },
        [navigation],
    );

    return {
        wines: list?.rows || [],
        isWinesLoading: isLoading,
        isWinesLoadingMore: isLoadingMore,
        winesEmptyTitle: localization.t(
            hasSearchCriteria ? 'wine.noResultsTitle' : 'wine.emptyListTitle',
        ),
        winesEmptyDescription: localization.t(
            hasSearchCriteria ? 'wine.noResultsDescription' : 'wine.emptyListDescription',
        ),
        winesListRef: listRef,
        onRefreshWines,
        onLoadMoreWines,
        onWinePress,
        onSearchWines,
        onResetWinesSearch,
        scrollWinesToTop,
    };
};
