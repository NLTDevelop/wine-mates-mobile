import { ISmellSubgroup } from '@/entities/wine/types/IWineSmell';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useCallback, useEffect, useState } from 'react';

export interface ISelectedSmell {
    id: number;
    color: string;
    value: string;
}

export const useWineSmell = () => {
    const data = wineModel.smells;
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

    const onItemPress = useCallback((item: ISmellSubgroup) => {
        console.log(item)
    }, []);

    const toggleList = useCallback(() => {
        setIsOpened(prevState => !!prevState);
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
                color: prevState[0].color,
                value: text,
            },
        ]);
    }, []);

    return { 
        data, selected, isError, getSmells, isLoading, search, setSearch, isOpened, onItemPress, toggleList, selectedIndex,
        handleLeftPress, handleRightPress, handleAddCustomSmell
    };
};
