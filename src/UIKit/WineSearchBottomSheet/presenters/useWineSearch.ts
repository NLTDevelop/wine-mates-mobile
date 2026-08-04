import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, TextInput } from 'react-native';
import { wineService } from '@/entities/wine/services/WineService';
import { wineOfferService } from '@/entities/wine/services/WineOfferService';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { WineSearchModeEnum } from '../enums/WineSearchModeEnum';

const SEARCH_LIMIT = 10;
const MIN_SEARCH_LENGTH = 1;
const SEARCH_DEBOUNCE_MS = 300;

export const useWineSearch = (mode = WineSearchModeEnum.WINE_SET) => {
    const searchInputRef = useRef<TextInput>(null);
    const activeRequestKeysRef = useRef(new Set<string>());
    const loadedPageKeysRef = useRef(new Set<string>());
    const latestSearchQueryRef = useRef('');
    const nextOffsetRef = useRef(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [isSearchListVisible, setIsSearchListVisible] = useState(false);
    const [isSearchingWines, setIsSearchingWines] = useState(false);
    const [isInitialSearchFinished, setIsInitialSearchFinished] = useState(false);
    const [isSearchListEndReached, setIsSearchListEndReached] = useState(false);
    const [wineSearchResults, setWineSearchResults] = useState<IWineSetSearchItem[]>([]);
    const hasWineSearchQuery = searchQuery.trim().length >= MIN_SEARCH_LENGTH;

    const clearSearchResults = useCallback(() => {
        setWineSearchResults([]);
        setIsSearchListEndReached(false);
        setIsInitialSearchFinished(false);
        nextOffsetRef.current = 0;
        latestSearchQueryRef.current = '';
        activeRequestKeysRef.current.clear();
        loadedPageKeysRef.current.clear();
    }, []);

    const getList = useCallback(
        async (offset: number, query: string) => {
            const normalizedQuery = query.trim();
            const requestKey = `${normalizedQuery}:${offset}`;

            if (normalizedQuery.length < MIN_SEARCH_LENGTH) {
                clearSearchResults();
                setIsSearchingWines(false);
                return;
            }

            if (offset === 0 && latestSearchQueryRef.current !== normalizedQuery) {
                latestSearchQueryRef.current = normalizedQuery;
                nextOffsetRef.current = 0;
                setIsSearchListEndReached(false);
                setIsInitialSearchFinished(false);
                activeRequestKeysRef.current.clear();
                loadedPageKeysRef.current.clear();
            }

            if (latestSearchQueryRef.current !== normalizedQuery) return;
            if (activeRequestKeysRef.current.has(requestKey) || loadedPageKeysRef.current.has(requestKey)) return;

            activeRequestKeysRef.current.add(requestKey);

            try {
                setIsSearchingWines(true);
                const search = mode === WineSearchModeEnum.OFFER ? wineOfferService.search : wineService.searchWineSet;
                const response = await search({
                    query: normalizedQuery,
                    limit: SEARCH_LIMIT,
                    offset,
                });

                if (latestSearchQueryRef.current !== normalizedQuery) return;
                if (response.isError || !response.data?.rows) {
                    if (offset === 0) clearSearchResults();
                    return;
                }

                loadedPageKeysRef.current.add(requestKey);
                const rows = response.data.rows;
                const count = typeof response.data.count === 'number' ? response.data.count : 0;
                const nextOffset = offset + SEARCH_LIMIT;
                nextOffsetRef.current = nextOffset;
                setIsSearchListEndReached(rows.length < SEARCH_LIMIT || nextOffset >= count);

                if (offset === 0) {
                    setIsInitialSearchFinished(true);
                    setWineSearchResults(rows);
                    return;
                }

                setWineSearchResults(previous => {
                    const previousIds = new Set(previous.map(item => item.id));
                    return [...previous, ...rows.filter(item => !previousIds.has(item.id))];
                });
            } catch (error) {
                loadedPageKeysRef.current.delete(requestKey);
                if (latestSearchQueryRef.current === normalizedQuery && offset === 0) clearSearchResults();
                console.warn('useWineSearch -> getList: ', error);
            } finally {
                activeRequestKeysRef.current.delete(requestKey);
                if (activeRequestKeysRef.current.size === 0) setIsSearchingWines(false);
            }
        },
        [clearSearchResults, mode],
    );

    const onChangeSearchQuery = useCallback(
        (value: string) => {
            const normalizedQuery = value.trim();
            setSearchQuery(value);
            setIsInitialSearchFinished(false);

            if (normalizedQuery.length < MIN_SEARCH_LENGTH) {
                clearSearchResults();
                setIsSearchingWines(false);
                return;
            }

            latestSearchQueryRef.current = normalizedQuery;
            nextOffsetRef.current = 0;
            setIsSearchListEndReached(false);
            activeRequestKeysRef.current.clear();
            loadedPageKeysRef.current.clear();
            setIsSearchListVisible(true);
        },
        [clearSearchResults],
    );

    const onOpenSearchModal = useCallback(() => {
        clearSearchResults();
        setSearchQuery('');
        setIsSearchModalVisible(true);
        setIsSearchListVisible(true);
        setTimeout(() => searchInputRef.current?.focus(), 250);
    }, [clearSearchResults]);

    const onReopenSearchModal = useCallback(() => {
        setIsSearchModalVisible(true);
        setIsSearchListVisible(true);
    }, []);

    const onHideSearchModal = useCallback(() => {
        Keyboard.dismiss();
        setIsSearchModalVisible(false);
        setIsSearchingWines(false);
    }, []);

    const onCloseSearchModal = useCallback(() => {
        onHideSearchModal();
        setIsSearchListVisible(false);
    }, [onHideSearchModal]);

    const onLoadMoreSearchResults = useCallback(() => {
        if (!hasWineSearchQuery || isSearchingWines || isSearchListEndReached || wineSearchResults.length === 0) return;
        getList(nextOffsetRef.current, searchQuery);
    }, [getList, hasWineSearchQuery, isSearchListEndReached, isSearchingWines, searchQuery, wineSearchResults.length]);

    const onResetSearch = useCallback(() => {
        setSearchQuery('');
        setIsSearchModalVisible(false);
        setIsSearchListVisible(false);
        setIsSearchingWines(false);
        clearSearchResults();
    }, [clearSearchResults]);

    useEffect(() => {
        const normalizedQuery = searchQuery.trim();
        if (normalizedQuery.length < MIN_SEARCH_LENGTH) return;

        const timeoutId = setTimeout(() => getList(0, normalizedQuery), SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timeoutId);
    }, [getList, searchQuery]);

    return useMemo(
        () => ({
            searchInputRef,
            searchQuery,
            isSearchModalVisible,
            isSearchListVisible,
            isSearchingWines,
            isInitialSearchFinished,
            hasMoreSearchResults: !isSearchListEndReached,
            wineSearchResults,
            onChangeSearchQuery,
            onOpenSearchModal,
            onReopenSearchModal,
            onHideSearchModal,
            onCloseSearchModal,
            onLoadMoreSearchResults,
            onResetSearch,
        }),
        [
            isInitialSearchFinished,
            isSearchListEndReached,
            isSearchListVisible,
            isSearchModalVisible,
            isSearchingWines,
            onChangeSearchQuery,
            onCloseSearchModal,
            onHideSearchModal,
            onLoadMoreSearchResults,
            onOpenSearchModal,
            onReopenSearchModal,
            onResetSearch,
            searchQuery,
            wineSearchResults,
        ],
    );
};
