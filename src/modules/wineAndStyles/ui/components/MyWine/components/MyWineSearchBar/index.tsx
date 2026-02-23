import { SearchBarWithFilter } from '@/UIKit/SearchBarWithFilter';
import { useUiContext } from '@/UIProvider';
import { useMyWineSearchBar } from './useMyWineSearchBar';
import { MyWineFiltersBottomSheet } from '../MyWineFiltersBottomSheet';
import { observer } from 'mobx-react-lite';
import { FilterTags } from './components/FilterTags';
import { View } from 'react-native';

interface IProps {
    onSearch: (offset: number) => Promise<void>;
    scrollToTop?: (() => void) | null;
}

const MyWineSearchBarComponent = ({ onSearch, scrollToTop }: IProps) => {
    const { t } = useUiContext();
    const { 
        search, 
        onSearchChange, 
        onFilterPress, 
        filtersModalRef, 
        onCloseFilters, 
        hasFilters, 
        onClearFilters,
        filters,
        selectedFilters,
        onSortChange,
        onColorsChange,
        onTypesChange,
        onApplyFilters,
        filterTags,
        onRemoveTag,
    } = useMyWineSearchBar({ onSearch, scrollToTop });

    return (
        <>
            <View>
                <SearchBarWithFilter
                    value={search}
                    onChangeText={onSearchChange}
                    placeholder={t('common.search')}
                    onFilterPress={onFilterPress}
                />
                <FilterTags tags={filterTags} onRemoveTag={onRemoveTag} />
            </View>
            <MyWineFiltersBottomSheet 
                modalRef={filtersModalRef} 
                onClose={onCloseFilters} 
                hasFilters={hasFilters}
                onClear={onClearFilters}
                filters={filters}
                selectedFilters={selectedFilters}
                onSortChange={onSortChange}
                onColorsChange={onColorsChange}
                onTypesChange={onTypesChange}
                onApply={onApplyFilters}
            />
        </>
    );
};

export const MyWineSearchBar = observer(MyWineSearchBarComponent);
