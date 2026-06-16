import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { wineService } from '@/entities/wine/services/WineService';
import { IWineChooserOption } from '@/entities/wine/types/IWineChooser';
import { WineChooserPickerKey } from '../types/IWineChooserPicker';

interface IProps {
    selectedTypeId?: number;
    selectedColorId?: number;
    showLoadError: (message?: string) => void;
    setLoadingPickerKey: Dispatch<SetStateAction<WineChooserPickerKey | null>>;
}

export const useChooseWineAromasFlavors = ({
    selectedTypeId,
    selectedColorId,
    showLoadError,
    setLoadingPickerKey,
}: IProps) => {
    const aromasFlavorsByTemplateRef = useRef<Record<string, { aromas: IWineChooserOption[]; flavors: IWineChooserOption[] }>>({});
    const [aromas, setAromas] = useState<IWineChooserOption[]>([]);
    const [flavors, setFlavors] = useState<IWineChooserOption[]>([]);

    const loadAromasFlavors = useCallback(async () => {
        if (!selectedTypeId || !selectedColorId) {
            return;
        }

        const cacheKey = `${selectedTypeId}:${selectedColorId}`;
        const cachedData = aromasFlavorsByTemplateRef.current[cacheKey];

        if (cachedData) {
            setAromas(cachedData.aromas);
            setFlavors(cachedData.flavors);
            return;
        }

        setLoadingPickerKey('aroma');
        const response = await wineService.getWineChooserAromasFlavors({
            typeId: selectedTypeId,
            colorId: selectedColorId,
        });

        if (response.isError || !response.data) {
            showLoadError(response.message);
        } else {
            const nextData = {
                aromas: response.data.aromas || [],
                flavors: response.data.flavors || [],
            };
            aromasFlavorsByTemplateRef.current[cacheKey] = nextData;
            setAromas(nextData.aromas);
            setFlavors(nextData.flavors);
        }

        setLoadingPickerKey(null);
    }, [selectedColorId, selectedTypeId, setLoadingPickerKey, showLoadError]);

    const syncAromasFlavorsForTemplate = useCallback(() => {
        if (!selectedTypeId || !selectedColorId) {
            setAromas(prevState => (prevState.length > 0 ? [] : prevState));
            setFlavors(prevState => (prevState.length > 0 ? [] : prevState));
            return;
        }

        const cacheKey = `${selectedTypeId}:${selectedColorId}`;
        const cachedData = aromasFlavorsByTemplateRef.current[cacheKey];

        if (cachedData) {
            setAromas(cachedData.aromas);
            setFlavors(cachedData.flavors);
            return;
        }

        setAromas(prevState => (prevState.length > 0 ? [] : prevState));
        setFlavors(prevState => (prevState.length > 0 ? [] : prevState));
    }, [selectedColorId, selectedTypeId]);

    return {
        aromas,
        flavors,
        setAromas,
        setFlavors,
        loadAromasFlavors,
        syncAromasFlavorsForTemplate,
    };
};
