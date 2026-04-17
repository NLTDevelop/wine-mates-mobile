import { observer } from 'mobx-react-lite';
import { FilterSection } from '../FilterSection';
import { IWineFilters } from '@/entities/wine/types/IWineFilters';
import { useUiContext } from '@/UIProvider';

interface IProps {
    filters: IWineFilters | null;
    selectedFilters: { sort: (string | number)[]; colors: (string | number)[]; types: (string | number)[] };
    onSortChange: (selected: (string | number)[]) => void;
    onColorsChange: (selected: (string | number)[]) => void;
    onTypesChange: (selected: (string | number)[]) => void;
}

export const FiltersContent = observer(({ filters, selectedFilters, onSortChange, onColorsChange, onTypesChange }: IProps) => {
    const { t } = useUiContext();

    return (
        <>
            {filters?.sort && (
                <FilterSection
                    title={t('wineAndStyles.sortBy')}
                    options={filters.sort}
                    multipleSelect={false}
                    onChange={onSortChange}
                    selectedValues={selectedFilters.sort}
                />
            )}
            {filters?.types && (
                <FilterSection
                    title={t('wineAndStyles.typeOfWine')}
                    options={filters.types}
                    multipleSelect={false}
                    onChange={onTypesChange}
                    selectedValues={selectedFilters.types}
                />
            )}
            {filters?.colors && (
                <FilterSection
                    title={t('wineAndStyles.colorOfWine')}
                    options={filters.colors}
                    multipleSelect={false}
                    onChange={onColorsChange}
                    selectedValues={selectedFilters.colors}
                />
            )}
        </>
    );
});
