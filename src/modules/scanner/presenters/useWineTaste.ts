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

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<IWineTaste[]>([]);
    const [selected, setSelected] = useState<IWineTaste[]>([]);
    const [isError, setIsError] = useState(false);
    const initialDataRef = useRef<IWineTaste[]>([]);

    const getTastes = useCallback(async () => {
        try {
            if (!wineModel.base?.colorOfWine?.id) return;

            setIsLoading(true);

            const payload = {
                colorId: wineModel.base?.colorOfWine.id,
            };

            const response = await wineService.getTastes(payload);

            if (response.isError || !response.data) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError(true);
                }
            } else {
                setData(response.data);
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
        return () => {
            wineModel.tastes = null;
            wineModel.selectedTastes = null;
        };
    }, []);

    useEffect(() => {
        const initial = wineModel.tastes ?? [];
        initialDataRef.current = initial;
        setData(initial);
    }, []);

    const onItemPress = useCallback((item: IWineTaste) => {
        setSelected(prevState => [...prevState, item]);
        setData(prevState => prevState.filter(taste => taste.id !== item.id));
    }, []);

    const onSelectedItemPress = useCallback((item: IWineTaste) => {
        setSelected(prevState => prevState.filter(taste => taste.id !== item.id));
        const isInitialTaste = initialDataRef.current.some(taste => taste.id === item.id);
        if (isInitialTaste) {
            setData(prevState => [...prevState, item]);
        }
    }, []);

    const handleAddCustomSmell = useCallback((text: string) => {
        setSelected(prevState => [
            ...prevState,
            { 
                id: Date.now() + Math.floor(Math.random() * 10000),
                colorHex: null,
                name: text,
                nameEn: text,
                nameUa: text,
            },
        ]);
    }, []);

    const handleNextPress = useCallback(() => {
        wineModel.selectedTastes = selected;
        // navigation.navigate('WineTasteCharacteristicsView');
    }, [navigation, selected]);

    return { 
        data, selected, isError, getTastes, isLoading, onItemPress, handleAddCustomSmell, onSelectedItemPress, handleNextPress
    };
};
