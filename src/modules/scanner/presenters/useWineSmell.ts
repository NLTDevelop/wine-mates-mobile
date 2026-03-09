import { IWineSelectedSmell } from '@/entities/wine/types/IWineSelectedSmell';
import { IAroma, IWineSmell } from '@/entities/wine/types/IWineSmell';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard } from 'react-native';

export const useWineSmell = (onHide: () => void) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const initialSelected = wineModel.selectedSmells ?? [];
    const [data, setData] = useState<IWineSmell[]>(() => {
        if (!wineModel.smells?.length) return [];
        return wineModel.smells.map(group => ({
            ...group,
            subgroups: group.subgroups.map(subgroup => ({
                ...subgroup,
                aromas: subgroup.aromas.filter(
                    aroma => !initialSelected.some(selectedItem => selectedItem.id === aroma.id),
                ),
            })),
        }));
    });
    const [isLoading, setIsLoading] = useState(() => !wineModel.smells?.length);
    const [isOpened, setIsOpened] = useState(false);
    const [selectedIndex, setSelectedIndex] =  useState(0);
    const [selected, setSelected] = useState<IWineSelectedSmell[]>(initialSelected);
    const [isError, setIsError] = useState(false);
    const initialData = wineModel.smells;

    const visibleSubgroups = useMemo(() => {
        const currentGroup = data[selectedIndex];
        if (!currentGroup) return [];
        return currentGroup.subgroups.filter(subgroup => subgroup.aromas.length > 0);
    }, [data, selectedIndex]);

    const getSmells = useCallback(async () => {
        try {
            if (!wineModel.base?.colorOfWine?.id || !wineModel.base?.typeOfWine?.id) return;

            if (wineModel.smells?.length) {
                setIsError(false);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            const params = {
                colorId: wineModel.base?.colorOfWine.id,
                typeId: wineModel.base?.typeOfWine.id,
            };

            const response = await wineService.getSmells(params);

            if (response.isError || response.data === null || response.data === undefined) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError(true);
                }
            } else {
                setData(response.data);
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
        if (!initialData?.length) {
            setData([]);
            return;
        }
        setData(
            initialData.map(group => ({
                ...group,
                subgroups: group.subgroups.map(subgroup => ({
                    ...subgroup,
                    aromas: subgroup.aromas.filter(
                        aroma => !selected.some(selectedItem => selectedItem.id === aroma.id),
                    ),
                })),
            })),
        );
    }, [initialData, selected]);

    useEffect(() => {
        wineModel.selectedSmells = selected.map(item => item);
    }, [selected]);

    const onItemPress = useCallback((item: IAroma, subgroupId?: number | null, groupId?: number | null) => {
        const addedSmell: IWineSelectedSmell = {
            id: item.id,
            colorHex: item.colorHex,
            name: item.name,
            subgroupId,
            groupId,
            aroma: item,
        };
        setSelected(prevState => [addedSmell, ...prevState]);
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
        Keyboard.dismiss();
        return item.id;
    }, [onHide]);

    const onSelectedItemPress = useCallback((item: IWineSelectedSmell) => {
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
        Keyboard.dismiss();
    }, []);

    const toggleList = useCallback(() => {
        setIsOpened(prevState => !prevState);
        Keyboard.dismiss();
    }, []);

    const handleGroupPress = useCallback((groupId: number) => {
        const nextIndex = data.findIndex(group => group.id === groupId);
        if (nextIndex === -1) return;
        setSelectedIndex(nextIndex);
        setIsOpened(true);
        Keyboard.dismiss();
    }, [data]);

    const handleLeftPress = useCallback(() => {
        if (data?.length) {
            setSelectedIndex(prevState => prevState === 0 ? data.length - 1 : prevState - 1);
        }
        Keyboard.dismiss();
    }, [data]);

    const handleRightPress = useCallback(() => {
        if (data?.length) {
            setSelectedIndex(prevState => prevState === data.length - 1 ? 0 : prevState + 1);
        }
        Keyboard.dismiss();
    }, [data]);

    const handleAddCustomSmell = useCallback((text: string) => {
        const newId = Date.now() + Math.floor(Math.random() * 10000);
        setSelected(prevState => [
            { 
                id: newId,
                colorHex: null,
                name: text,
            },
            ...prevState,
        ]);
        Keyboard.dismiss();
        return newId;
    }, []);

    const handleNextPress = useCallback(() => {
        navigation.navigate('WineTasteView');
        Keyboard.dismiss();
    }, [navigation, selected]);

    return { 
        data, selected, isError, getSmells, isLoading, isOpened, onItemPress, toggleList, selectedIndex,
        handleLeftPress, handleRightPress, handleAddCustomSmell, onSelectedItemPress, handleNextPress, visibleSubgroups,
        handleGroupPress,
    };
};
