import { IWineSelectedSmell } from '@/entities/wine/types/IWineSelectedSmell';
import { IAroma, ISmellSubgroup, IWineSmell } from '@/entities/wine/types/IWineSmell';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard } from 'react-native';

export const useTastingWineSmell = (onHide: () => void) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const source = (route.params as { source?: string } | undefined)?.source ?? 'scanner';
    const wineId = (route.params as { wineId?: number } | undefined)?.wineId;

    const colorId = wineModel.base?.colorOfWine?.id ?? null;
    const typeId = wineModel.base?.typeOfWine?.id ?? null;
    const hasSmells = Boolean(wineModel.smells?.length);

    const initialSelected = wineModel.selectedSmells ?? [];
    const [isLoading, setIsLoading] = useState(() => !hasSmells || !colorId || !typeId);
    const [isOpened, setIsOpened] = useState(false);
    const [selectedIndex, setSelectedIndex] =  useState(0);
    const [selected, setSelected] = useState<IWineSelectedSmell[]>(initialSelected);
    const [isError, setIsError] = useState(false);
    const data: IWineSmell[] = (() => {
        if (!wineModel.smells?.length) {
            return [];
        }

        return wineModel.smells.map(group => ({
            ...group,
            subgroups: group.subgroups.map(subgroup => ({
                ...subgroup,
                aromas: subgroup.aromas.filter(
                    aroma => !selected.some(selectedItem => selectedItem.id === aroma.id),
                ),
            })),
        }));
    })();

    const visibleSubgroups = useMemo(() => {
        const currentGroup = data[selectedIndex];
        if (!currentGroup) return [];
        return currentGroup.subgroups.filter(subgroup => {
            if (!subgroup.hiddenItemId) {
                return true;
            }

            const isHiddenSelected = selected.some(item => item.id === subgroup.hiddenItemId);
            return !isHiddenSelected;
        });
    }, [data, selected, selectedIndex]);

    const getSmells = useCallback(async () => {
        try {
            if (!colorId || !typeId) {
                setIsLoading(true);
                return;
            }

            if (wineModel.smells?.length) {
                setIsError(false);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            const params = {
                colorId,
                typeId,
            };

            const response = await wineService.getSmells(params);

            if (response.isError || response.data === null || response.data === undefined) {
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
    }, [colorId, typeId]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            getSmells();
        }, 0);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [getSmells]);

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
        setSelected(prevState => {
            if (prevState.some(selectedItem => selectedItem.id === item.id)) {
                return prevState;
            }

            return [addedSmell, ...prevState];
        });
        onHide();
        Keyboard.dismiss();
        return item.id;
    }, [onHide]);

    const onSubgroupPress = useCallback((subgroup: ISmellSubgroup, groupId: number) => {
        if (subgroup.aromas.length > 0) {
            return false;
        }

        if (!subgroup.hiddenItemId) {
            return true;
        }

        const hiddenAroma: IAroma = {
            id: subgroup.hiddenItemId,
            colorHex: subgroup.colorHex,
            name: subgroup.name,
            sortNumber: subgroup.sortNumber,
        };

        const addedSmell: IWineSelectedSmell = {
            id: hiddenAroma.id,
            colorHex: hiddenAroma.colorHex,
            name: hiddenAroma.name,
            subgroupId: subgroup.id,
            groupId,
            aroma: hiddenAroma,
            isHiddenSubgroupItem: true,
        };

        setSelected(prevState => {
            if (prevState.some(item => item.id === addedSmell.id)) {
                return prevState;
            }

            return [addedSmell, ...prevState];
        });

        Keyboard.dismiss();
        return true;
    }, []);

    const onSelectedItemPress = useCallback((item: IWineSelectedSmell) => {
        setSelected(prevState => prevState.filter(smell => smell.id !== item.id));
        Keyboard.dismiss();
    }, []);

    const toggleList = useCallback(() => {
        setIsOpened(prevState => !prevState);
        Keyboard.dismiss();
    }, []);

    const onGroupPress = useCallback((groupId: number) => {
        const nextIndex = data.findIndex(group => group.id === groupId);
        if (nextIndex === -1) return;
        setSelectedIndex(nextIndex);
        setIsOpened(true);
        Keyboard.dismiss();
    }, [data]);

    const onLeftPress = useCallback(() => {
        if (data?.length) {
            setSelectedIndex(prevState => prevState === 0 ? data.length - 1 : prevState - 1);
        }
        Keyboard.dismiss();
    }, [data]);

    const onRightPress = useCallback(() => {
        if (data?.length) {
            setSelectedIndex(prevState => prevState === data.length - 1 ? 0 : prevState + 1);
        }
        Keyboard.dismiss();
    }, [data]);

    const onAddCustomSmell = useCallback((text: string) => {
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

    const onNextPress = useCallback(() => {
        navigation.navigate('WineTasteView', { source, wineId });
        Keyboard.dismiss();
    }, [navigation, source, wineId]);

    return { 
        data, selected, isError, getSmells, isLoading, isOpened, onItemPress, toggleList, selectedIndex,
        onLeftPress, onRightPress, onAddCustomSmell, onSelectedItemPress, onNextPress, visibleSubgroups,
        onGroupPress, onSubgroupPress,
    };
};
