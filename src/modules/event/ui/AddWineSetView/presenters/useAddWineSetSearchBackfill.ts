import { useEffect } from 'react';

interface IProps {
    hasMoreSearchResults: boolean;
    isInitialSearchFinished: boolean;
    isSearchListVisible: boolean;
    isSearchingWines: boolean;
    maxVisibleSearchResults: number;
    searchResultItemsCount: number;
    wineSearchResultsCount: number;
    onLoadMoreSearchResults: () => void;
}

export const useAddWineSetSearchBackfill = ({
    hasMoreSearchResults,
    isInitialSearchFinished,
    isSearchListVisible,
    isSearchingWines,
    maxVisibleSearchResults,
    searchResultItemsCount,
    wineSearchResultsCount,
    onLoadMoreSearchResults,
}: IProps) => {
    useEffect(() => {
        const shouldBackfillSearchResults = isSearchListVisible
            && isInitialSearchFinished
            && !isSearchingWines
            && hasMoreSearchResults
            && wineSearchResultsCount > 0
            && searchResultItemsCount < maxVisibleSearchResults;

        if (!shouldBackfillSearchResults) {
            return;
        }

        onLoadMoreSearchResults();
    }, [
        hasMoreSearchResults,
        isInitialSearchFinished,
        isSearchListVisible,
        isSearchingWines,
        maxVisibleSearchResults,
        onLoadMoreSearchResults,
        searchResultItemsCount,
        wineSearchResultsCount,
    ]);
};
