import { useEffect, useMemo, useRef } from 'react';
import { IWineSearchResultViewItem } from '@/modules/event/types/IWineSetViewItem';
import { FlatList } from 'react-native-gesture-handler';

interface IProps {
    searchQuery: string;
    isSearchingWines: boolean;
    wineSearchResultItems: IWineSearchResultViewItem[];
    shouldShowScannerButton: boolean;
    maxVisibleSearchResults: number;
}

export const useWineSetListHeader = ({
    searchQuery,
    isSearchingWines,
    wineSearchResultItems,
    shouldShowScannerButton,
    maxVisibleSearchResults,
}: IProps) => {
    const searchResultsListRef = useRef<FlatList<IWineSearchResultViewItem> | null>(null);
    const shouldScrollAfterResponseRef = useRef(false);

    const isSearchSectionVisible = useMemo(() => {
        return wineSearchResultItems.length > 0 || shouldShowScannerButton;
    }, [shouldShowScannerButton, wineSearchResultItems.length]);

    const isSearchResultsVisible = useMemo(() => {
        return wineSearchResultItems.length > 0;
    }, [wineSearchResultItems.length]);

    const isSearchResultsScrollable = useMemo(() => {
        return wineSearchResultItems.length > maxVisibleSearchResults;
    }, [maxVisibleSearchResults, wineSearchResultItems.length]);

    useEffect(() => {
        shouldScrollAfterResponseRef.current = !!searchQuery.trim();
    }, [searchQuery]);

    useEffect(() => {
        if (isSearchingWines || !shouldScrollAfterResponseRef.current) {
            return;
        }

        searchResultsListRef.current?.scrollToOffset({ offset: 0, animated: false });
        shouldScrollAfterResponseRef.current = false;
    }, [isSearchingWines, wineSearchResultItems]);

    return {
        searchResultsListRef,
        isSearchSectionVisible,
        isSearchResultsVisible,
        isSearchResultsScrollable,
    };
};
