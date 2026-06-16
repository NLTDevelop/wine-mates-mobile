import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { wineService } from '@/entities/wine/services/WineService';
import { IWineChooserOption } from '@/entities/wine/types/IWineChooser';
import { WineChooserPickerKey } from '../types/IWineChooserPicker';

interface IProps {
    showLoadError: (message?: string) => void;
    setLoadingPickerKey: Dispatch<SetStateAction<WineChooserPickerKey | null>>;
}

export const useChooseWineRegions = ({ showLoadError, setLoadingPickerKey }: IProps) => {
    const regionsByCountryIdRef = useRef<Record<number, IWineChooserOption[]>>({});
    const [regions, setRegions] = useState<IWineChooserOption[]>([]);

    const loadRegionsByCountryId = useCallback(async (countryId: number) => {
        if (!countryId) {
            return;
        }

        const cachedRegions = regionsByCountryIdRef.current[countryId];

        if (cachedRegions) {
            setRegions(cachedRegions);
            return;
        }

        setLoadingPickerKey('region');
        const response = await wineService.getWineChooserRegions({ countryId });

        if (response.isError || !response.data) {
            showLoadError(response.message);
            setRegions([]);
        } else {
            regionsByCountryIdRef.current[countryId] = response.data;
            setRegions(response.data);
        }

        setLoadingPickerKey(null);
    }, [setLoadingPickerKey, showLoadError]);

    return {
        regions,
        setRegions,
        loadRegionsByCountryId,
    };
};
