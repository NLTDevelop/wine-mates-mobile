import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { wineService } from '@/entities/wine/services/WineService';
import { IWineChooserGrapeVariety } from '@/entities/wine/types/IWineChooser';
import { WineChooserPickerKey } from '../types/IWineChooserPicker';

interface IProps {
    showLoadError: (message?: string) => void;
    setLoadingPickerKey: Dispatch<SetStateAction<WineChooserPickerKey | null>>;
}

const GRAPE_LIMIT = 100;

export const useChooseWineGrapeVarieties = ({ showLoadError, setLoadingPickerKey }: IProps) => {
    const grapeVarietiesLoadedRef = useRef(false);
    const [grapeVarieties, setGrapeVarieties] = useState<IWineChooserGrapeVariety[]>([]);

    const loadGrapeVarieties = useCallback(async () => {
        if (grapeVarietiesLoadedRef.current) {
            return;
        }

        setLoadingPickerKey('grape');
        const response = await wineService.getWineChooserGrapeVarieties({ limit: GRAPE_LIMIT, offset: 0 });

        if (response.isError || !response.data) {
            showLoadError(response.message);
        } else {
            grapeVarietiesLoadedRef.current = true;
            setGrapeVarieties(response.data.rows);
        }

        setLoadingPickerKey(null);
    }, [setLoadingPickerKey, showLoadError]);

    return {
        grapeVarieties,
        loadGrapeVarieties,
    };
};
