import { IWineTaste } from '@/entities/wine/types/IWineTaste';
import { IWineTasteGroup } from '@/entities/wine/types/IWineTatseGroup';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';

const filterGroups = (groups: IWineTasteGroup[], selected: IWineTaste[]) =>
    groups.map(group => ({
        ...group,
        flavors: group.flavors.filter(flavor => !selected.some(selectedItem => selectedItem.id === flavor.id)),
    }));

export const useWineTaste = (onHide?: () => void) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const initialSelected = wineModel.selectedTastes ?? [];
    const [isLoading, setIsLoading] = useState(() => !wineModel.tastes?.length);
    const [data, setData] = useState<IWineTasteGroup[]>(() => {
        if (!wineModel.tastes?.length) return [];
        return filterGroups(wineModel.tastes, initialSelected);
    });
    const [selected, setSelected] = useState<IWineTaste[]>(initialSelected);
    const [isError, setIsError] = useState(false);
    const initialDataRef = useRef<IWineTasteGroup[]>([]);
    const selectedRef = useRef<IWineTaste[]>(initialSelected);
    const initialData = wineModel.tastes;

    const getTastes = useCallback(async () => {
        try {
            if (!wineModel.base?.colorOfWine?.id) return;

            if (wineModel.tastes?.length) {
                setIsError(false);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            const params = {
                colorId: wineModel.base?.colorOfWine.id,
                typeId: wineModel.base.typeOfWine.id,
            };

            const response = await wineService.getTastes(params);

            if (response.isError || !response.data) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError(true);
                }
            } else {
                const nextData = filterGroups(response.data, selectedRef.current);
                setData(nextData);
                initialDataRef.current = response.data;
                setIsError(false);
            }
        } catch (error) {
            console.error('getTastes error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getTastes();
    }, [getTastes]);

    useEffect(() => {
        const initial = initialData ?? [];
        initialDataRef.current = initial;
        setData(filterGroups(initial, selected));
    }, [initialData, selected]);

    useEffect(() => {
        wineModel.selectedTastes = selected;
    }, [selected]);

    useEffect(() => {
        selectedRef.current = selected;
    }, [selected]);

    const onItemPress = useCallback((item: IWineTaste, _subgroupId?: number | null, groupId?: number | null) => {
        setSelected(prevState => [item, ...prevState]);
        if (groupId) {
            setData(prevState =>
                prevState.map(group => {
                    if (group.id !== groupId) return group;
                    return {
                        ...group,
                        flavors: group.flavors.filter(flavor => flavor.id !== item.id),
                    };
                }),
            );
        }
        onHide?.();
        return item.id;
    }, [onHide]);

    const onSelectedItemPress = useCallback((item: IWineTaste) => {
        setSelected(prevState => prevState.filter(taste => taste.id !== item.id));
        const originalGroup = initialDataRef.current.find(group => group.flavors.some(flavor => flavor.id === item.id));
        if (originalGroup) {
            setData(prevState =>
                prevState.map(group => {
                    if (group.id !== originalGroup.id) return group;
                    const hasFlavor = group.flavors.some(flavor => flavor.id === item.id);
                    const flavors = hasFlavor
                        ? group.flavors
                        : [...group.flavors, item].sort((a, b) => a.sortNumber - b.sortNumber);
                    return {
                        ...group,
                        flavors,
                    };
                }),
            );
        }
    }, []);

    const handleAddCustomTaste = useCallback((text: string) => {
        const newId = Date.now() + Math.floor(Math.random() * 10000);
        setSelected(prevState => [
            { 
                id: newId,
                colorHex: null,
                name: text,
                sortNumber: 1,
            },
            ...prevState,
        ]);
        return newId;
    }, []);

    const handleNextPress = useCallback(() => {
        navigation.navigate('WineTasteCharacteristicsView');
    }, [navigation, selected]);

    return { 
        data, selected, isError, getTastes, isLoading, onItemPress, handleAddCustomTaste, onSelectedItemPress, handleNextPress
    };
};
