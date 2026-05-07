import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, Keyboard, TextInput, View } from 'react-native';
import { wineService } from '@/entities/wine/WineService';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';

const SEARCH_LIMIT = 10;
const MIN_SEARCH_LENGTH = 1;
const SEARCH_DEBOUNCE_MS = 300;

export const useAddWineSetSearch = () => {
    const searchInputRef = useRef<TextInput>(null);
    const searchTouchAreaRef = useRef<View>(null);
    const activeRequestKeysRef = useRef(new Set<string>());
    const loadedPageKeysRef = useRef(new Set<string>());
    const latestSearchQueryRef = useRef('');
    const nextOffsetRef = useRef(0);

    const [searchQuery, setSearchQuery] = useState('');
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

    const getList = useCallback(async (offset: number, query: string) => {
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

        if (latestSearchQueryRef.current !== normalizedQuery) {
            return;
        }

        if (activeRequestKeysRef.current.has(requestKey) || loadedPageKeysRef.current.has(requestKey)) {
            return;
        }

        activeRequestKeysRef.current.add(requestKey);

        try {
            setIsSearchingWines(true);

            const response = await wineService.searchWineSet({
                query: normalizedQuery,
                limit: SEARCH_LIMIT,
                offset,
            });

            if (latestSearchQueryRef.current !== normalizedQuery) {
                return;
            }

            if (response.isError || !response.data?.rows) {
                if (offset === 0) {
                    clearSearchResults();
                }
                return;
            }

            loadedPageKeysRef.current.add(requestKey);

            const rows = response.data.rows;
            const count = typeof response.data.count === 'number' ? response.data.count : 0;
            const nextOffset = offset + SEARCH_LIMIT;
            const isLastPage = rows.length < SEARCH_LIMIT || nextOffset >= count;
            nextOffsetRef.current = nextOffset;
            setIsSearchListEndReached(isLastPage);

            if (offset === 0) {
                setIsInitialSearchFinished(true);
                setWineSearchResults(rows);
                return;
            }

            setWineSearchResults((prev) => {
                const prevIds = new Set(prev.map((item) => item.id));
                const uniqueRows = rows.filter((item) => !prevIds.has(item.id));
                return [...prev, ...uniqueRows];
            });
        } catch (error) {
            loadedPageKeysRef.current.delete(requestKey);

            if (latestSearchQueryRef.current === normalizedQuery && offset === 0) {
                clearSearchResults();
            }

            console.warn('useAddWineSetSearch -> getList: ', error);
        } finally {
            activeRequestKeysRef.current.delete(requestKey);

            if (activeRequestKeysRef.current.size === 0) {
                setIsSearchingWines(false);
            }
        }
    }, [clearSearchResults]);

    const onChangeSearchQuery = useCallback((value: string) => {
        const normalizedQuery = value.trim();

        setSearchQuery(value);
        setIsInitialSearchFinished(false);

        if (normalizedQuery.length < MIN_SEARCH_LENGTH) {
            clearSearchResults();
            setIsSearchListVisible(false);
            setIsSearchingWines(false);
            return;
        }

        latestSearchQueryRef.current = normalizedQuery;
        nextOffsetRef.current = 0;
        setIsSearchListEndReached(false);
        activeRequestKeysRef.current.clear();
        loadedPageKeysRef.current.clear();
        setIsSearchListVisible(true);
    }, [clearSearchResults]);

    const onFocusSearchInput = useCallback(() => {
        const normalizedQuery = searchQuery.trim();

        if (normalizedQuery.length < MIN_SEARCH_LENGTH) {
            return;
        }

        setIsSearchListVisible(true);

        if (wineSearchResults.length === 0 && !isSearchingWines) {
            getList(0, normalizedQuery);
        }
    }, [getList, isSearchingWines, searchQuery, wineSearchResults.length]);

    const onLoadMoreSearchResults = useCallback(() => {
        if (!hasWineSearchQuery || isSearchingWines || isSearchListEndReached || wineSearchResults.length === 0) {
            return;
        }

        getList(nextOffsetRef.current, searchQuery);
    }, [getList, hasWineSearchQuery, isSearchListEndReached, isSearchingWines, searchQuery, wineSearchResults.length]);

    const onResetSearch = useCallback(() => {
        setSearchQuery('');
        setIsSearchListVisible(false);
        setIsSearchingWines(false);
        clearSearchResults();
    }, [clearSearchResults]);

    const onCloseSearchList = useCallback(() => {
        setIsSearchListVisible(false);
        setIsSearchingWines(false);
        Keyboard.dismiss();
    }, []);

    const onPressOutsideSearch = useCallback((event: GestureResponderEvent) => {
        if (!isSearchListVisible) {
            return false;
        }

        const { pageX, pageY } = event.nativeEvent;

        searchTouchAreaRef.current?.measureInWindow((x, y, width, height) => {
            const isInsideSearchArea = pageX >= x && pageX <= x + width && pageY >= y && pageY <= y + height;

            if (!isInsideSearchArea) {
                onCloseSearchList();
            }
        });

        return false;
    }, [isSearchListVisible, onCloseSearchList]);

    useEffect(() => {
        const normalizedQuery = searchQuery.trim();

        if (normalizedQuery.length < MIN_SEARCH_LENGTH) {
            return;
        }

        const timeoutId = setTimeout(() => {
            getList(0, normalizedQuery);
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [getList, searchQuery]);

    return useMemo(() => ({
        searchInputRef,
        searchTouchAreaRef,
        searchQuery,
        isSearchListVisible,
        isSearchingWines,
        isInitialSearchFinished,
        wineSearchResults,
        onChangeSearchQuery,
        onFocusSearchInput,
        onLoadMoreSearchResults,
        onResetSearch,
        onPressOutsideSearch,
    }), [
        isInitialSearchFinished,
        isSearchListVisible,
        isSearchingWines,
        onChangeSearchQuery,
        onFocusSearchInput,
        onLoadMoreSearchResults,
        onPressOutsideSearch,
        onResetSearch,
        searchQuery,
        wineSearchResults,
    ]);
};
