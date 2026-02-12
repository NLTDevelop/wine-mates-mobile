import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';
import { wineListsModel } from '@/entities/wine/WineListsModel';
import { computed } from 'mobx';

export const useMyWineFiltersBottomSheet = () => {
    const filtersModalRef = useRef<BottomSheetModal | null>(null);
    const selectedFilters = wineListsModel.filters;

    const hasFilters = computed(() => {
        return selectedFilters.sort.length > 0 || 
               selectedFilters.colors.length > 0 || 
               selectedFilters.types.length > 0;
    }).get();

    const onClose = useCallback(() => {
        filtersModalRef.current?.dismiss();
    }, []);

    const onOpen = useCallback(() => {
        filtersModalRef.current?.present();
    }, []);

    const onClear = useCallback(() => {
        wineListsModel.clearFilters();
    }, []);

    const onSortChange = useCallback((selected: (string | number)[]) => {
        wineListsModel.setSort(selected);
    }, []);

    const onColorsChange = useCallback((selected: (string | number)[]) => {
        wineListsModel.setColors(selected);
    }, []);

    const onTypesChange = useCallback((selected: (string | number)[]) => {
        wineListsModel.setTypes(selected);
    }, []);

    return { 
        filtersModalRef, 
        onClose, 
        onOpen, 
        hasFilters, 
        onClear, 
        selectedFilters,
        onSortChange,
        onColorsChange,
        onTypesChange,
    };
};
