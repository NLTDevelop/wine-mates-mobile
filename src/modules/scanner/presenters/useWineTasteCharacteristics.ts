import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';

export const useWineTasteCharacteristics = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const data = wineModel.tasteCharacteristics;

    const getTasteCharacteristics = useCallback(async () => {
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
                setIsError(false);
            }
        } catch (error) {
            console.error('getTastes error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getTasteCharacteristics();
    }, [getTasteCharacteristics]);

    useEffect(() => {
        return () => {
            wineModel.tasteCharacteristics = null;
            wineModel.selectedTasteCharacteristics = null;
        };
    }, []);


    const handleNextPress = useCallback(() => {
        // wineModel.selectedTasteCharacteristics = selected.map(item => item.id);
        // navigation.navigate('WineTasteCharacteristicsView');
    }, [navigation]);

    return {  data, isError, getTasteCharacteristics, isLoading, handleNextPress };
};
