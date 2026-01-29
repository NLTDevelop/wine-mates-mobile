import { IWineAroma } from '@/entities/wine/types/IWineAroma';
import { IAroma, IWineSmell } from '@/entities/wine/types/IWineSmell';
import { IWineSelectedSmell } from '@/entities/wine/types/IWineSelectedSmell';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { useDebounce } from '@/hooks/useDebounce';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useCallback, useState } from 'react';

interface IProps {
    data: IWineSmell[],
    selected: IWineSelectedSmell[],
    onItemPress: (item: IAroma, subgroupId?: number | null, groupId?: number | null) => void,
    onSelectedItemPress: (item: IWineSelectedSmell) => void,
}

export const useWineSmellSearch = ({ data, selected, onItemPress, onSelectedItemPress }: IProps) => {
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isDebouncing, setIsDebouncing] = useState(false);

    const getSearchedAromas = useCallback(async (query: string) => {
        try {
            if (!query || !wineModel.base?.colorOfWine.id || !wineModel.base?.typeOfWine?.id) {
                wineModel.searchedAroma = null;
                return;
            }

            setIsDebouncing(false);
            setIsSearching(true);

            const params = {
                search: query,
                colorId: wineModel.base?.colorOfWine.id,
                typeId: wineModel.base?.typeOfWine.id,
            }

            const response = await wineService.getAromas(params);

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
        const selectedSmell = selected.find(current => current.id === item.id);

        if (selectedSmell) {
            onSelectedItemPress(selectedSmell);
            return;
        }

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
    }, [data, onItemPress, onSelectedItemPress, selected]);

    const onSearchTextChange = useCallback((value: string) => {
        setSearch(value);
        if (value) {
            setIsDebouncing(true);
            wineModel.searchedAroma = null;
        } else {
            setIsDebouncing(false);
            wineModel.searchedAroma = null;
        }
        debouncedOnSearch(value);
    }, [debouncedOnSearch]);

    const searchedAromas = wineModel.searchedAroma;
        
    return { isSearching, isDebouncing, searchedAromas, search, onSearchTextChange, onSearchItemPress };
};
