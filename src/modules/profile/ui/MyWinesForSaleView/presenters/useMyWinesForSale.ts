import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IList } from '@/entities/IList';
import {
    IOfferedWineListItem,
    IWineOfferSaveResult,
    IWineOfferSummary,
    IWineOfferTarget,
} from '@/entities/wine/types/IOfferedWineListItem';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { wineOfferService } from '@/entities/wine/services/WineOfferService';
import { wineSetScannerModel } from '@/entities/events/WineSetScannerModel';
import { localization } from '@/UIProvider/localization/Localization';
import { toastService } from '@/libs/toast/toastService';
import { IWineSearchResultItem } from '@/UIKit/WineSearchBottomSheet/types/IWineSearchResultItem';
import { getWineDisplaySubtitle, getWineDisplayTitle } from '@/entities/wine/utils/wineDisplayFormatter';
import { IWineListSearchQuery } from '@/modules/profile/types/IWineListSearchQuery';
import { usePaginationRequestGuard } from '@/hooks/usePaginationRequestGuard';

const LIMIT = 10;

interface IRouteParams {
    selectedWine?: IWineSetSearchItem;
    shouldReopenWineSearch?: boolean;
}

type Route = RouteProp<Record<'MyWinesForSaleView', IRouteParams | undefined>, 'MyWinesForSaleView'>;

interface IProps {
    searchQuery: string;
    isSearchListVisible: boolean;
    wineSearchResults: IWineSetSearchItem[];
    onOpenSearchModal: () => void;
    onReopenSearchModal: () => void;
    onHideSearchModal: () => void;
    onResetSearch: () => void;
}

export const useMyWinesForSale = ({
    searchQuery,
    isSearchListVisible,
    wineSearchResults,
    onOpenSearchModal,
    onReopenSearchModal,
    onHideSearchModal,
    onResetSearch,
}: IProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<Route>();
    const [list, setList] = useState<IList<IOfferedWineListItem> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isError, setIsError] = useState(false);
    const [hasSearchCriteria, setHasSearchCriteria] = useState(false);
    const [selectedWine, setSelectedWine] = useState<IWineOfferTarget | null>(null);
    const [selectedOffer, setSelectedOffer] = useState<IWineOfferSummary | null>(null);
    const [shouldReturnToSearch, setShouldReturnToSearch] = useState(false);
    const listRef = useRef<FlatList<IOfferedWineListItem>>(null);
    const searchQueryRef = useRef<IWineListSearchQuery>({ search: '' });
    const listRequestIdRef = useRef(0);
    const { onTryStartPaginationRequest, onResetPaginationRequests } = usePaginationRequestGuard();

    const loadWines = useCallback(async (offset: number, mode: 'initial' | 'refresh' | 'more') => {
        const requestId = mode === 'more' ? listRequestIdRef.current : ++listRequestIdRef.current;

        if (mode === 'initial') {
            setIsLoading(true);
        } else if (mode === 'refresh') {
            setIsRefreshing(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            setIsError(false);
            const response = await wineOfferService.getMyOffers({
                offset,
                limit: LIMIT,
                ...searchQueryRef.current,
            });

            if (requestId !== listRequestIdRef.current) {
                return;
            }

            if (response.isError || !response.data) {
                setIsError(true);
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            const responseData = response.data;
            setList(previous => {
                if (offset === 0 || !previous) {
                    return responseData;
                }

                const existingIds = new Set(previous.rows.map(item => item.id));
                return {
                    ...responseData,
                    rows: [...previous.rows, ...responseData.rows.filter(item => !existingIds.has(item.id))],
                };
            });
        } catch (error) {
            if (requestId !== listRequestIdRef.current) {
                return;
            }

            console.error('useMyWinesForSale -> loadWines: ', error);
            setIsError(true);
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        } finally {
            if (requestId === listRequestIdRef.current) {
                setIsLoading(false);
                setIsRefreshing(false);
                setIsLoadingMore(false);
            }
        }
    }, []);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            onResetPaginationRequests();
            loadWines(0, 'initial');
        });
        return () => cancelAnimationFrame(frameId);
    }, [loadWines, onResetPaginationRequests]);

    useEffect(() => {
        const scannerWine = route.params?.selectedWine;
        const shouldReopen = route.params?.shouldReopenWineSearch;

        if (!scannerWine && !shouldReopen) {
            return;
        }

        const frameId = requestAnimationFrame(() => {
            navigation.setParams({ selectedWine: undefined, shouldReopenWineSearch: undefined });
            if (scannerWine) {
                onHideSearchModal();
                setSelectedWine(scannerWine);
                setSelectedOffer(null);
                setShouldReturnToSearch(true);
                return;
            }

            onReopenSearchModal();
        });

        return () => cancelAnimationFrame(frameId);
    }, [navigation, onHideSearchModal, onReopenSearchModal, route.params?.selectedWine, route.params?.shouldReopenWineSearch]);

    const onRefresh = useCallback(async () => {
        onResetPaginationRequests();
        await loadWines(0, 'refresh');
    }, [loadWines, onResetPaginationRequests]);

    const scrollToTop = useCallback(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    const onSearch = useCallback(async (query: IWineListSearchQuery) => {
        searchQueryRef.current = query;
        setHasSearchCriteria(Boolean(query.search.trim() || query.typeId || query.colorId));
        onResetPaginationRequests();
        await loadWines(0, 'initial');
    }, [loadWines, onResetPaginationRequests]);

    const onEndReached = useCallback(async () => {
        const offset = list?.rows.length || 0;
        if (
            !list ||
            isLoading ||
            isRefreshing ||
            isLoadingMore ||
            offset >= list.count ||
            !onTryStartPaginationRequest(offset)
        ) {
            return;
        }
        await loadWines(offset, 'more');
    }, [isLoading, isLoadingMore, isRefreshing, list, loadWines, onTryStartPaginationRequest]);

    const onPressBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onItemPress = useCallback((item: IWineListItem) => {
        navigation.navigate('WineDetailsView', { wineId: item.id, vintages: 'All' });
    }, [navigation]);

    const onOfferPress = useCallback((wine: IWineListItem, offer: IWineOfferSummary | null) => {
        setShouldReturnToSearch(false);
        setSelectedWine(wine);
        setSelectedOffer(offer);
    }, []);

    const createOnSelectWinePress = useCallback((wine: IWineSetSearchItem) => {
        return () => {
            onHideSearchModal();
            setSelectedWine(wine);
            setSelectedOffer(null);
            setShouldReturnToSearch(true);
        };
    }, [onHideSearchModal]);

    const wineSearchResultItems = useMemo<IWineSearchResultItem[]>(() => {
        if (!isSearchListVisible) {
            return [];
        }

        return wineSearchResults.map(wine => ({
            id: wine.id,
            title: getWineDisplayTitle(wine),
            subtitle: getWineDisplaySubtitle(wine, localization.locale, false),
            onPress: createOnSelectWinePress(wine),
        }));
    }, [createOnSelectWinePress, isSearchListVisible, wineSearchResults]);

    const wineSearchEmptyText = useMemo(() => {
        if (!searchQuery.trim()) {
            return localization.t('event.startTypingWineSearch');
        }

        return localization.t('common.nothingFoundTitle');
    }, [searchQuery]);

    const onCloseOfferModal = useCallback(() => {
        setSelectedWine(null);
        setSelectedOffer(null);
        if (shouldReturnToSearch) {
            onReopenSearchModal();
        }
        setShouldReturnToSearch(false);
    }, [onReopenSearchModal, shouldReturnToSearch]);

    const onOfferSaved = useCallback((result: IWineOfferSaveResult) => {
        setList(previous => {
            if (!previous) {
                return result.type === 'created'
                    ? { rows: [result.wine], count: 1, totalPages: 1 }
                    : previous;
            }

            if (result.type === 'updated') {
                return {
                    ...previous,
                    rows: previous.rows.map(wine =>
                        wine.id === result.wineId ? { ...wine, offer: result.offer } : wine,
                    ),
                };
            }

            const isExisting = previous.rows.some(wine => wine.id === result.wine.id);
            return {
                ...previous,
                count: previous.count + (isExisting ? 0 : 1),
                rows: [result.wine, ...previous.rows.filter(wine => wine.id !== result.wine.id)],
            };
        });
        setSelectedWine(null);
        setSelectedOffer(null);
        setShouldReturnToSearch(false);
        onResetSearch();
    }, [onResetSearch]);

    const onOfferDeleted = useCallback((wineId: number) => {
        setList(previous => previous
            ? {
                ...previous,
                count: Math.max(0, previous.count - 1),
                rows: previous.rows.filter(wine => wine.id !== wineId),
            }
            : previous,
        );
        setSelectedWine(null);
        setSelectedOffer(null);
        setShouldReturnToSearch(false);
    }, []);

    const onAddWinePress = useCallback(() => {
        onOpenSearchModal();
    }, [onOpenSearchModal]);

    const onOpenScannerPress = useCallback(() => {
        wineSetScannerModel.setState({ returnRoute: 'MyWinesForSaleView' });
        onHideSearchModal();
        navigation.navigate('TabNavigator', {
            screen: 'ScannerStack',
            params: { screen: 'ScannerView' },
        });
    }, [navigation, onHideSearchModal]);

    return {
        data: list?.rows || [],
        isLoading,
        isLoadingMore,
        isError,
        isOfferModalVisible: Boolean(selectedWine),
        emptyTitle: localization.t(hasSearchCriteria ? 'wine.noResultsTitle' : 'profile.noWinesForSale'),
        emptyDescription: localization.t(
            hasSearchCriteria ? 'wine.noResultsDescription' : 'wine.emptyListDescription',
        ),
        selectedWine,
        selectedOffer,
        listRef,
        wineSearchResultItems,
        wineSearchEmptyText,
        onRefresh,
        onEndReached,
        onSearch,
        scrollToTop,
        onPressBack,
        onItemPress,
        onOfferPress,
        onCloseOfferModal,
        onOfferSaved,
        onOfferDeleted,
        onAddWinePress,
        onOpenScannerPress,
    };
};
