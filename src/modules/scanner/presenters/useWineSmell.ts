import { IAroma, IWineSmell } from '@/entities/wine/types/IWineSmell';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useCallback, useEffect, useState } from 'react';

export interface ISelectedSmell {
    id: number;
    color: string | null;
    value: string;
    subgroupId?: number | null;
    groupId?: number | null;
    aroma?: IAroma;
}

export const useWineSmell = (onHide: () => void) => {
    const initialData = wineModel.smells;
    const [data, setData] = useState<IWineSmell[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpened, setIsOpened] = useState(false);
    const [selectedIndex, setSelectedIndex] =  useState(0);
    const [selected, setSelected] = useState<ISelectedSmell[]>([]);
    const [search, setSearch] = useState('');
    const [isError, setIsError] = useState(false);

    const getSmells = useCallback(async () => {
        try {
            if (!wineModel.base?.colorOfWine?.id) return;

            setIsLoading(true);

            const payload = {
                colorId: wineModel.base?.colorOfWine.id,
            };

            const response = await wineService.getSmells(payload);

            if (response.isError || !response.data) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError(true);
                }
            } else {
                setIsError(false);
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getSmells();
    }, [getSmells]);

    useEffect(() => {
        return () => {
            wineModel.smells = null;
        };
    }, []);

    useEffect(() => {
        if (initialData?.length) {
            setData(
                initialData.map(group => ({
                    ...group,
                    subgroups: group.subgroups.map(subgroup => ({
                        ...subgroup,
                        aromas: [...subgroup.aromas],
                    })),
                })),
            );
        } else {
            setData([]);
        }
    }, [initialData]);

    const onItemPress = useCallback((item: IAroma, subgroupId?: number | null, groupId?: number | null) => {
        const addedSmell: ISelectedSmell = {
            id: item.id,
            color: item.colorHex,
            value: item.name || item.nameEn,
            subgroupId,
            groupId,
            aroma: item,
        };
        setSelected(prevState => [...prevState, addedSmell]);
        if (subgroupId && groupId) {
            setData(prevState =>
                prevState.map(group => {
                    if (group.id !== groupId) return group;
                    return {
                        ...group,
                        subgroups: group.subgroups.map(subgroup => {
                            if (subgroup.id !== subgroupId) return subgroup;
                            return {
                                ...subgroup,
                                aromas: subgroup.aromas.filter(aroma => aroma.id !== item.id),
                            };
                        }),
                    };
                }),
            );
        }
        onHide();
    }, [onHide]);

    const onSelectedItemPress = useCallback((item: ISelectedSmell) => {
        if (item.subgroupId && item.groupId && item.aroma) {
            setData(prevState =>
                prevState.map(group => {
                    if (group.id !== item.groupId) return group;
                    return {
                        ...group,
                        subgroups: group.subgroups.map(subgroup => {
                            if (subgroup.id !== item.subgroupId) return subgroup;
                            const hasAroma = subgroup.aromas.some(aroma => aroma.id === item.id);
                            const aromas = hasAroma
                                ? subgroup.aromas
                                : [...subgroup.aromas, item.aroma]
                                      .filter((a): a is IAroma => !!a)
                                      .sort((a, b) => a.sortNumber - b.sortNumber);
                            return {
                                ...subgroup,
                                aromas,
                            };
                        }),
                    };
                }),
            );
        }
        setSelected(prevState => prevState.filter(smell => smell.id !== item.id));
    }, []);

    const toggleList = useCallback(() => {
        setIsOpened(prevState => !prevState);
    }, []);

    const handleLeftPress = useCallback(() => {
        if (data?.length) {
            setSelectedIndex(prevState => prevState === 0 ? data.length - 1 : prevState - 1);
        }
    }, [data]);

    const handleRightPress = useCallback(() => {
        if (data?.length) {
            setSelectedIndex(prevState => prevState === data.length - 1 ? 0 : prevState + 1);
        }
    }, [data]);

    const handleAddCustomSmell = useCallback((text: string) => {
        setSelected(prevState => [
            ...prevState,
            { 
                id: Date.now() + Math.floor(Math.random() * 10000),
                color: null,
                value: text,
            },
        ]);
    }, []);

    return { 
        data, selected, isError, getSmells, isLoading, search, setSearch, isOpened, onItemPress, toggleList, selectedIndex,
        handleLeftPress, handleRightPress, handleAddCustomSmell, onSelectedItemPress
    };
};
