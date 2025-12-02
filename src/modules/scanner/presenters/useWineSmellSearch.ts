import { IWineAroma } from '@/entities/wine/types/IWineAroma';
import { IAroma, IWineSmell } from '@/entities/wine/types/IWineSmell';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { useDebounce } from '@/hooks/useDebounce';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useCallback, useState } from 'react';

interface IProps {
    data: IWineSmell[],
    onItemPress: (item: IAroma, subgroupId?: number | null, groupId?: number | null) => void,
}

export const useWineSmellSearch = ({ data, onItemPress }: IProps) => {
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const getSearchedAromas = useCallback(async (query: string) => {
        try {
            if (!query) return;

            setIsSearching(true);

            const response = await wineService.getAromas({ search: query });

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsSearching(false);
        }
    }, []);

    const { debouncedWrapper: debouncedOnSearch } = useDebounce(getSearchedAromas, 500);

    const onSearchItemPress = useCallback((item: IWineAroma) => {
        const group = data.find(currentGroup => currentGroup.subgroups.some(subgroup => subgroup.id === item.subgroupId));
        const subgroup = group?.subgroups.find(currentSubgroup => currentSubgroup.id === item.subgroupId);
        const aromaToAdd: IAroma =
            subgroup?.aromas.find(aroma => aroma.id === item.id) ?? {
                id: item.id,
                name: item.name,
                colorHex: item.colorHex,
                sortNumber: subgroup?.aromas.length ?? 0,
            };

        onItemPress(aromaToAdd, subgroup?.id ?? item.subgroupId, group?.id ?? null);
    }, [data, onItemPress]);

    const onSearchTextChange = useCallback((value: string) => {
        setSearch(value);
        debouncedOnSearch(value);
    }, [debouncedOnSearch]);

    const searchedAromas = wineModel.searchedAroma;
        
    return { isSearching, searchedAromas, search, onSearchTextChange, onSearchItemPress };
};
