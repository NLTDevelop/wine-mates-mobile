import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { wineService } from '@/entities/wine/services/WineService';
import { IWineChooserVintage } from '@/entities/wine/types/IWineChooser';
import { WineChooserPickerKey } from '../types/IWineChooserPicker';

interface IProps {
    showLoadError: (message?: string) => void;
    setLoadingPickerKey: Dispatch<SetStateAction<WineChooserPickerKey | null>>;
}

export const useChooseWineVintages = ({ showLoadError, setLoadingPickerKey }: IProps) => {
    const vintagesLoadedRef = useRef(false);
    const [vintages, setVintages] = useState<IWineChooserVintage[]>([]);

    const loadVintages = useCallback(async () => {
        if (vintagesLoadedRef.current) {
            return;
        }

        setLoadingPickerKey('vintage');
        const response = await wineService.getWineChooserVintages();

        if (response.isError || !response.data) {
            showLoadError(response.message);
        } else {
            vintagesLoadedRef.current = true;
            setVintages(response.data);
        }

        setLoadingPickerKey(null);
    }, [setLoadingPickerKey, showLoadError]);

    return {
        vintages,
        loadVintages,
    };
};
