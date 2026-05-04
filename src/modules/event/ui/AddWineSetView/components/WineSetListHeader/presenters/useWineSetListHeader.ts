import { useMemo } from 'react';
import { IWineSearchResultViewItem } from '@/modules/event/types/IWineSetViewItem';

interface IProps {
    wineSearchResultItems: IWineSearchResultViewItem[];
    shouldShowScannerButton: boolean;
    maxVisibleSearchResults: number;
}

export const useWineSetListHeader = ({
    wineSearchResultItems,
    shouldShowScannerButton,
    maxVisibleSearchResults,
}: IProps) => {
    const isSearchSectionVisible = useMemo(() => {
        return wineSearchResultItems.length > 0 || shouldShowScannerButton;
    }, [shouldShowScannerButton, wineSearchResultItems.length]);

    const isSearchResultsVisible = useMemo(() => {
        return wineSearchResultItems.length > 0;
    }, [wineSearchResultItems.length]);

    const isSearchResultsScrollable = useMemo(() => {
        return wineSearchResultItems.length > maxVisibleSearchResults;
    }, [maxVisibleSearchResults, wineSearchResultItems.length]);

    return {
        isSearchSectionVisible,
        isSearchResultsVisible,
        isSearchResultsScrollable,
    };
};
