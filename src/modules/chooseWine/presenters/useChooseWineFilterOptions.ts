import { useCallback, useRef, useState } from 'react';
import { wineService } from '@/entities/wine/services/WineService';
import { IWineChooserFilterOptions, IWineChooserFilterOptionsRequest } from '@/entities/wine/types/IWineChooser';

const EMPTY_FILTER_OPTIONS: IWineChooserFilterOptions = {
    countries: [],
    regions: [],
    types: [],
    colors: [],
    vintages: [],
    grapeVarieties: [],
    aromas: [],
    flavors: [],
    ratings: undefined,
    tasteCharacteristics: [],
    genderOptions: [],
    ageRange: undefined,
};

interface IProps {
    showLoadError: (message?: string) => void;
}

export const useChooseWineFilterOptions = ({ showLoadError }: IProps) => {
    const requestIdRef = useRef(0);
    const [filterOptions, setFilterOptions] = useState<IWineChooserFilterOptions>(EMPTY_FILTER_OPTIONS);
    const [isFilterOptionsLoading, setIsFilterOptionsLoading] = useState(false);

    const loadFilterOptions = useCallback(
        async (data: IWineChooserFilterOptionsRequest) => {
            requestIdRef.current += 1;
            const requestId = requestIdRef.current;
            setIsFilterOptionsLoading(true);

            const response = await wineService.getWineChooserFilterOptions(data);

            if (requestId !== requestIdRef.current) {
                return null;
            }

            setIsFilterOptionsLoading(false);

            if (response.isError || !response.data) {
                showLoadError(response.message);
                return null;
            }

            setFilterOptions(response.data);
            return response.data;
        },
        [showLoadError],
    );

    return {
        filterOptions,
        isFilterOptionsLoading,
        loadFilterOptions,
    };
};
