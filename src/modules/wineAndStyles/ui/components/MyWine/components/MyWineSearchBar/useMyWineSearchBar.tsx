import { myWineListModel } from '@/entities/wine/MyWineListModel';
import { myWineService } from '@/entities/wine/MyWineService';
import { useDebounce } from '@/hooks/useDebounce';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useCallback, useEffect } from 'react';
import { useMyWineFiltersBottomSheet } from '../MyWineFiltersBottomSheet/useMyWineFiltersBottomSheet';

interface IUseMyWineSearchBarProps {
    onSearch: (offset: number) => Promise<void>;
}

export const useMyWineSearchBar = ({ onSearch }: IUseMyWineSearchBarProps) => {
    const search = myWineListModel.search;
    const { 
        filtersModalRef, 
        onOpen, 
        onClose, 
        hasFilters, 
        onClear, 
        selectedFilters,
        onSortChange,
        onColorsChange,
        onTypesChange,
    } = useMyWineFiltersBottomSheet();
    const filters = myWineListModel.filtersData;

    const { debouncedWrapper: debouncedSearch } = useDebounce(() => onSearch(0), 400);

    const fetchFilters = useCallback(async () => {
        try {
            const response = await myWineService.getFilters();

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            } else {
                console.log('FILTERS DATA:', JSON.stringify(response.data, null, 2));
                myWineListModel.filtersData = response.data;
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 4));
        }
    }, []);

    useEffect(() => {
        fetchFilters();
    }, [fetchFilters]);

    const onSearchChange = useCallback((text: string) => {
        myWineListModel.search = text;
        debouncedSearch();
    }, [debouncedSearch]);

    const onFilterPress = useCallback(() => {
        onOpen();
    },[onOpen]);

    const onApplyFilters = useCallback(() => {
        onClose();
        onSearch(0);
    }, [onClose, onSearch]);

    return { 
        search, 
        onSearchChange, 
        onFilterPress, 
        filtersModalRef, 
        onCloseFilters: onClose, 
        hasFilters, 
        onClearFilters: onClear, 
        filters,
        selectedFilters,
        onSortChange,
        onColorsChange,
        onTypesChange,
        onApplyFilters,
    };
};
