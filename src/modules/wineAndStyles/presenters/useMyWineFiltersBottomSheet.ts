import { useCallback, useState } from 'react';
import { computed } from 'mobx';
import { ISelectedFilters, wineListsModel } from '@/entities/wine/models/WineListsModel';

export const useMyWineFiltersBottomSheet = () => {
    const appliedFilters = wineListsModel.filters;
    const [isVisible, setIsVisible] = useState(false);
    
    const [tempFilters, setTempFilters] = useState<ISelectedFilters>({
        sort: [...appliedFilters.sort],
        colors: [...appliedFilters.colors],
        types: [...appliedFilters.types],
    });

    const hasFilters = computed(() => {
        return tempFilters.sort.length > 0 || 
               tempFilters.colors.length > 0 || 
               tempFilters.types.length > 0;
    }).get();

    const onClose = useCallback(() => {
        setTempFilters({
            sort: [...appliedFilters.sort],
            colors: [...appliedFilters.colors],
            types: [...appliedFilters.types],
        });
        setIsVisible(false);
    }, [appliedFilters]);

    const onOpen = useCallback(() => {
        setTempFilters({
            sort: [...appliedFilters.sort],
            colors: [...appliedFilters.colors],
            types: [...appliedFilters.types],
        });
        setIsVisible(true);
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
        wineListsModel.filters = tempFilters;
    }, [tempFilters]);

    return { 
        isVisible,
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
