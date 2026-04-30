import { wineListsModel } from '@/entities/wine/WineListsModel';
import { myWineService } from '@/entities/wine/MyWineService';
import { useDebounce } from '@/hooks/useDebounce';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useCallback, useEffect } from 'react';
import { useMyWineFiltersBottomSheet } from './useMyWineFiltersBottomSheet';
import { IFilterTagItem } from '../ui/components/FilterTags';
import { computed } from 'mobx';

interface IUseMyWineSearchBarProps {
    onSearch: (offset: number) => Promise<void>;
    scrollToTop?: (() => void) | null;
}

export const useMyWineSearchBar = ({ onSearch, scrollToTop }: IUseMyWineSearchBarProps) => {
    const search = wineListsModel.search;
    const { 
        isVisible,
        onOpen, 
        onClose, 
        hasFilters, 
        onClear, 
        selectedFilters,
        onSortChange,
        onColorsChange,
        onTypesChange,
        onApply: applyFilters,
    } = useMyWineFiltersBottomSheet();
    const filters = wineListsModel.filtersData;

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
                wineListsModel.filtersData = response.data;
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 4));
        }
    }, []);

    useEffect(() => {
        fetchFilters();
    }, [fetchFilters]);

    const onSearchChange = useCallback((text: string) => {
        wineListsModel.search = text;
        scrollToTop?.();
        debouncedSearch();
    }, [debouncedSearch, scrollToTop]);

    const onFilterPress = useCallback(() => {
        onOpen();
    },[onOpen]);

    const onApplyFilters = useCallback(() => {
        applyFilters();
        onClose();
        scrollToTop?.();
        onSearch(0);
    }, [applyFilters, onClose, onSearch, scrollToTop]);

    const filterTags = computed((): IFilterTagItem[] => {
        const tags: IFilterTagItem[] = [];
        const filtersData = wineListsModel.filtersData;
        const appliedFilters = wineListsModel.filters;

        if (!filtersData) {
            return tags;
        }

        appliedFilters.sort.forEach((value) => {
            const option = filtersData.sort.find((opt) => opt.value === value);
            if (option) {
                tags.push({ label: option.label, value, type: 'sort' });
            }
        });

        appliedFilters.colors.forEach((value) => {
            const option = filtersData.colors.find((opt) => opt.value === value);
            if (option) {
                tags.push({ label: option.label, value, type: 'color' });
            }
        });

        appliedFilters.types.forEach((value) => {
            const option = filtersData.types.find((opt) => opt.value === value);
            if (option) {
                tags.push({ label: option.label, value, type: 'type' });
            }
        });

        return tags;
    }).get();

    const onRemoveTag = useCallback((tag: IFilterTagItem) => {
        const currentFilters = wineListsModel.filters;

        if (tag.type === 'sort') {
            const newSort = currentFilters.sort.filter((v) => v !== tag.value);
            wineListsModel.setSort(newSort);
        } else if (tag.type === 'color') {
            const newColors = currentFilters.colors.filter((v) => v !== tag.value);
            wineListsModel.setColors(newColors);
        } else if (tag.type === 'type') {
            const newTypes = currentFilters.types.filter((v) => v !== tag.value);
            wineListsModel.setTypes(newTypes);
        }

        scrollToTop?.();
        onSearch(0);
    }, [onSearch, scrollToTop]);

    return { 
        search, 
        onSearchChange, 
        onFilterPress, 
        isFiltersModalVisible: isVisible,
        onCloseFilters: onClose, 
        hasFilters, 
        onClearFilters: onClear, 
        filters,
        selectedFilters,
        onSortChange,
        onColorsChange,
        onTypesChange,
        onApplyFilters,
        filterTags,
        onRemoveTag,
    };
};
