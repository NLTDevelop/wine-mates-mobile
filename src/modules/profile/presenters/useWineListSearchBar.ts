import { useCallback, useEffect, useMemo, useState } from 'react';
import { myWineService } from '@/entities/wine/services/MyWineService';
import { ISelectedFilters } from '@/entities/wine/models/WineListsModel';
import { IWineFilters } from '@/entities/wine/types/IWineFilters';
import { useDebounce } from '@/hooks/useDebounce';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { IFilterTagItem } from '@/modules/wineAndStyles/types/IFilterTagItem';
import { IWineListSearchQuery } from '../types/IWineListSearchQuery';

interface IProps {
    onSearch: (query: IWineListSearchQuery) => Promise<void>;
    scrollToTop?: () => void;
}

const EMPTY_FILTERS: ISelectedFilters = {
    sort: [],
    colors: [],
    types: [],
};

const getSearchQuery = (search: string, filters: ISelectedFilters): IWineListSearchQuery => ({
    search,
    sort: filters.sort.length > 0 ? filters.sort[0] : undefined,
    typeId: filters.types.length > 0 ? filters.types[0] : undefined,
    colorId: filters.colors.length > 0 ? filters.colors[0] : undefined,
});

export const useWineListSearchBar = ({ onSearch, scrollToTop }: IProps) => {
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<IWineFilters | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<ISelectedFilters>(EMPTY_FILTERS);
    const [draftFilters, setDraftFilters] = useState<ISelectedFilters>(EMPTY_FILTERS);
    const [isFiltersModalVisible, setIsFiltersModalVisible] = useState(false);

    const fetchFilters = useCallback(async () => {
        try {
            const response = await myWineService.getFilters();

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            setFilters(response.data);
        } catch (error) {
            console.error('useWineListSearchBar -> fetchFilters: ', error);
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        }
    }, []);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            fetchFilters();
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [fetchFilters]);

    const { debouncedWrapper: debouncedSearch, cancelDebounce } = useDebounce((nextSearch: string) => {
        onSearch(getSearchQuery(nextSearch, selectedFilters));
    }, 400);

    useEffect(() => {
        return cancelDebounce;
    }, [cancelDebounce]);

    const onSearchChange = useCallback((text: string) => {
        setSearch(text);
        scrollToTop?.();
        debouncedSearch(text);
    }, [debouncedSearch, scrollToTop]);

    const onFilterPress = useCallback(() => {
        setDraftFilters({
            sort: [...selectedFilters.sort],
            colors: [...selectedFilters.colors],
            types: [...selectedFilters.types],
        });
        setIsFiltersModalVisible(true);
    }, [selectedFilters]);

    const onCloseFilters = useCallback(() => {
        setIsFiltersModalVisible(false);
    }, []);

    const onClearFilters = useCallback(() => {
        setDraftFilters(EMPTY_FILTERS);
    }, []);

    const onSortChange = useCallback((selected: (string | number)[]) => {
        setDraftFilters(current => ({ ...current, sort: selected }));
    }, []);

    const onColorsChange = useCallback((selected: (string | number)[]) => {
        setDraftFilters(current => ({ ...current, colors: selected }));
    }, []);

    const onTypesChange = useCallback((selected: (string | number)[]) => {
        setDraftFilters(current => ({ ...current, types: selected }));
    }, []);

    const onApplyFilters = useCallback(() => {
        cancelDebounce();
        setSelectedFilters(draftFilters);
        setIsFiltersModalVisible(false);
        scrollToTop?.();
        onSearch(getSearchQuery(search, draftFilters));
    }, [cancelDebounce, draftFilters, onSearch, scrollToTop, search]);

    const filterTags = useMemo<IFilterTagItem[]>(() => {
        if (!filters) {
            return [];
        }

        const tags: IFilterTagItem[] = [];

        selectedFilters.sort.forEach(value => {
            const option = filters.sort.find(item => item.value === value);
            if (option) {
                tags.push({ label: option.label, value, type: 'sort' });
            }
        });
        selectedFilters.colors.forEach(value => {
            const option = filters.colors.find(item => item.value === value);
            if (option) {
                tags.push({ label: option.label, value, type: 'color' });
            }
        });
        selectedFilters.types.forEach(value => {
            const option = filters.types.find(item => item.value === value);
            if (option) {
                tags.push({ label: option.label, value, type: 'type' });
            }
        });

        return tags;
    }, [filters, selectedFilters]);

    const onRemoveTag = useCallback((tag: IFilterTagItem) => {
        cancelDebounce();
        const nextFilters = {
            sort: tag.type === 'sort'
                ? selectedFilters.sort.filter(value => value !== tag.value)
                : selectedFilters.sort,
            colors: tag.type === 'color'
                ? selectedFilters.colors.filter(value => value !== tag.value)
                : selectedFilters.colors,
            types: tag.type === 'type'
                ? selectedFilters.types.filter(value => value !== tag.value)
                : selectedFilters.types,
        };

        setSelectedFilters(nextFilters);
        scrollToTop?.();
        onSearch(getSearchQuery(search, nextFilters));
    }, [cancelDebounce, onSearch, scrollToTop, search, selectedFilters]);

    const hasFilters = draftFilters.sort.length > 0 ||
        draftFilters.colors.length > 0 ||
        draftFilters.types.length > 0;

    return {
        search,
        filters,
        selectedFilters: draftFilters,
        filterTags,
        hasFilters,
        isFiltersModalVisible,
        onSearchChange,
        onFilterPress,
        onCloseFilters,
        onClearFilters,
        onSortChange,
        onColorsChange,
        onTypesChange,
        onApplyFilters,
        onRemoveTag,
    };
};
