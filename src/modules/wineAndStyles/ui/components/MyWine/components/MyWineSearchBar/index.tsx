import { SearchBarWithFilter } from '@/UIKit/SearchBarWithFilter';
import { useUiContext } from '@/UIProvider';
import { useMyWineSearchBar } from './useMyWineSearchBar';
import { MyWineFiltersBottomSheet } from '../MyWineFiltersBottomSheet';
import { observer } from 'mobx-react-lite';

interface IProps {
    onSearch: (offset: number) => Promise<void>;
}

const MyWineSearchBarComponent = ({ onSearch }: IProps) => {
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
    } = useMyWineSearchBar({ onSearch });

    return (
        <>
            <SearchBarWithFilter
                value={search}
                onChangeText={onSearchChange}
                placeholder={t('common.search')}
                onFilterPress={onFilterPress}
            />
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
