import { IWineTaste } from '@/entities/wine/types/IWineTaste';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useWineTaste = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const initialSelected = wineModel.selectedTastes ?? [];
    const [isLoading, setIsLoading] = useState(() => !wineModel.tastes?.length);
    const [data, setData] = useState<IWineTaste[]>(() => {
        if (!wineModel.tastes?.length) return [];
        return wineModel.tastes.filter(taste => !initialSelected.some(selectedItem => selectedItem.id === taste.id));
    });
    const [selected, setSelected] = useState<IWineTaste[]>(initialSelected);
    const [isError, setIsError] = useState(false);
    const initialDataRef = useRef<IWineTaste[]>([]);
    const selectedRef = useRef<IWineTaste[]>(initialSelected);
    const initialData = wineModel.tastes;

    const getTastes = useCallback(async () => {
        try {
            if (!wineModel.base?.colorOfWine?.id || !wineModel.base?.typeOfWine?.id) return;

            if (wineModel.tastes?.length) {
                setIsError(false);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            const params = {
                colorId: wineModel.base?.colorOfWine.id,
                typeId: wineModel.base?.typeOfWine.id,
            };

            const response = await wineService.getTasteGroups(params);

            if (response.isError || !response.data) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError(true);
                }
            } else {
                const nextData = response.data.filter(
                    taste => !selectedRef.current.some(selectedItem => selectedItem.id === taste.id),
                );
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
        setData(initial.filter(taste => !selected.some(selectedItem => selectedItem.id === taste.id)));
    }, [initialData, selected]);

    useEffect(() => {
        wineModel.selectedTastes = selected;
    }, [selected]);

    useEffect(() => {
        selectedRef.current = selected;
    }, [selected]);

    const onItemPress = useCallback((item: IWineTaste) => {
        setSelected(prevState => [item, ...prevState]);
        setData(prevState => prevState.filter(taste => taste.id !== item.id));
        return item.id;
    }, []);

    const onSelectedItemPress = useCallback((item: IWineTaste) => {
        setSelected(prevState => prevState.filter(taste => taste.id !== item.id));
        const isInitialTaste = initialDataRef.current.some(taste => taste.id === item.id);
        if (isInitialTaste) {
            setData(prevState => [...prevState, item]);
        }
    }, []);

    const handleAddCustomTaste = useCallback((text: string) => {
        const newId = Date.now() + Math.floor(Math.random() * 10000);
        setSelected(prevState => [
            { 
                id: newId,
                colorHex: null,
                name: text,
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
