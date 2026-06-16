import { useCallback, useRef, useState } from 'react';
import { wineService } from '@/entities/wine/services/WineService';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';

interface IProps {
    selectedTypeId?: number;
    selectedColorId?: number;
}

export const useChooseWineTasteCharacteristics = ({ selectedTypeId, selectedColorId }: IProps) => {
    const tasteCharacteristicsByTemplateRef = useRef<Record<string, IWineTasteCharacteristic[]>>({});
    const [tasteCharacteristics, setTasteCharacteristics] = useState<IWineTasteCharacteristic[]>([]);

    const loadTasteCharacteristics = useCallback(async () => {
        if (!selectedTypeId || !selectedColorId) {
            setTasteCharacteristics([]);
            return;
        }

        const cacheKey = `${selectedTypeId}:${selectedColorId}`;
        const cachedData = tasteCharacteristicsByTemplateRef.current[cacheKey];

        if (cachedData) {
            setTasteCharacteristics(cachedData);
            return;
        }

        const response = await wineService.getTastesCharacteristics({
            typeId: selectedTypeId,
            colorId: selectedColorId,
        });

        if (!response.isError && response.data) {
            tasteCharacteristicsByTemplateRef.current[cacheKey] = response.data;
            setTasteCharacteristics(response.data);
        }
    }, [selectedColorId, selectedTypeId]);

    return {
        tasteCharacteristics,
        loadTasteCharacteristics,
    };
};
