import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';
import { wineListsModel } from '@/entities/wine/WineListsModel';
import { computed } from 'mobx';
import { ISelectedFilters } from '@/entities/wine/WineListsModel';

export const useMyWineFiltersBottomSheet = () => {
    const filtersModalRef = useRef<BottomSheetModal | null>(null);
    const appliedFilters = wineListsModel.filters;
    
    const [tempFilters, setTempFilters] = useState<ISelectedFilters>({
        sort: appliedFilters.sort,
        colors: appliedFilters.colors,
        types: appliedFilters.types,
    });

    const hasFilters = computed(() => {
        return tempFilters.sort.length > 0 || 
               tempFilters.colors.length > 0 || 
               tempFilters.types.length > 0;
    }).get();

    const onClose = useCallback(() => {
        setTempFilters({
            sort: appliedFilters.sort,
            colors: appliedFilters.colors,
            types: appliedFilters.types,
        });
        filtersModalRef.current?.dismiss();
    }, [appliedFilters]);

    const onOpen = useCallback(() => {
        setTempFilters({
            sort: appliedFilters.sort,
            colors: appliedFilters.colors,
            types: appliedFilters.types,
        });
        filtersModalRef.current?.present();
    }, [appliedFilters]);

    const onClear = useCallback(() => {
        setTempFilters({
            sort: [],
            colors: [],
            types: [],
        });
    }, []);

    const onSortChange = useCallback((selected: (string | number)[]) => {
        setTempFilters(prev => ({ ...prev, sort: selected }));
    }, []);

    const onColorsChange = useCallback((selected: (string | number)[]) => {
        setTempFilters(prev => ({ ...prev, colors: selected }));
    }, []);

    const onTypesChange = useCallback((selected: (string | number)[]) => {
        setTempFilters(prev => ({ ...prev, types: selected }));
    }, []);

    const onApply = useCallback(() => {
        wineListsModel.setSort(tempFilters.sort);
        wineListsModel.setColors(tempFilters.colors);
        wineListsModel.setTypes(tempFilters.types);
    }, [tempFilters]);

    return { 
        filtersModalRef, 
        onClose, 
        onOpen, 
        hasFilters, 
        onClear, 
        selectedFilters: tempFilters,
        onSortChange,
        onColorsChange,
        onTypesChange,
        onApply,
    };
};
