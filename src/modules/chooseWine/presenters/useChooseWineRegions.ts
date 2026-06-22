import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { wineService } from '@/entities/wine/services/WineService';
import { IWineChooserOption } from '@/entities/wine/types/IWineChooser';
import { WineChooserPickerKey } from '../types/IWineChooserPicker';

interface IProps {
    showLoadError: (message?: string) => void;
    setLoadingPickerKey: Dispatch<SetStateAction<WineChooserPickerKey | null>>;
}

export const useChooseWineRegions = ({ showLoadError, setLoadingPickerKey }: IProps) => {
    const regionsByCountryIdsRef = useRef<Record<string, IWineChooserOption[]>>({});
    const [regions, setRegions] = useState<IWineChooserOption[]>([]);

    const loadRegionsByCountryIds = useCallback(async (countryIds: number[]) => {
        if (countryIds.length === 0) {
            return;
        }

        const regionCountryIds = [...countryIds].sort((leftId, rightId) => leftId - rightId);
        const regionCountryIdsKey = regionCountryIds.join(',');
        const cachedRegions = regionsByCountryIdsRef.current[regionCountryIdsKey];

        if (cachedRegions) {
            setRegions(cachedRegions);
            return;
        }

        setLoadingPickerKey('region');
        const response = await wineService.getWineChooserRegions({ countryIds: regionCountryIdsKey });

        if (response.isError || !response.data) {
            showLoadError(response.message);
            setRegions([]);
        } else {
            regionsByCountryIdsRef.current[regionCountryIdsKey] = response.data;
            setRegions(response.data);
        }

        setLoadingPickerKey(null);
    }, [setLoadingPickerKey, showLoadError]);

    return {
        regions,
        setRegions,
        loadRegionsByCountryIds,
    };
};
