import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { SearchBarWithFilter } from '@/UIKit/SearchBarWithFilter';
import { MyWineFiltersBottomSheet } from '@/modules/wineAndStyles/ui/components/MyWineFiltersBottomSheet';
import { FilterTags } from '@/modules/wineAndStyles/ui/components/FilterTags';
import { useWineListSearchBar } from '@/modules/profile/presenters/useWineListSearchBar';
import { IWineListSearchQuery } from '@/modules/profile/types/IWineListSearchQuery';

interface IProps {
    onSearch: (query: IWineListSearchQuery) => Promise<void>;
    scrollToTop?: () => void;
}

export const WineListSearchBar = ({ onSearch, scrollToTop }: IProps) => {
    const { t } = useUiContext();
    const {
        search,
        filters,
        selectedFilters,
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
    } = useWineListSearchBar({ onSearch, scrollToTop });

    return (
        <>
            <View>
                <SearchBarWithFilter
                    value={search}
                    onChangeText={onSearchChange}
                    placeholder={t('common.search')}
                    onFilterPress={onFilterPress}
                    hasActiveFilter={filterTags.length > 0}
                />
                <FilterTags tags={filterTags} onRemoveTag={onRemoveTag} />
            </View>
            {isFiltersModalVisible ? (
                <MyWineFiltersBottomSheet
                    isVisible={isFiltersModalVisible}
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
            ) : null}
        </>
    );
};
