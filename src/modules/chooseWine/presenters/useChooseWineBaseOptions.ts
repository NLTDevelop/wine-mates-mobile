import { useCallback, useRef, useState } from 'react';
import { wineService } from '@/entities/wine/services/WineService';
import { IWineChooserOption } from '@/entities/wine/types/IWineChooser';
import { IWineType } from '@/entities/wine/types/IWineType';
import { IWineColor } from '@/entities/wine/types/IWineColors';

export const useChooseWineBaseOptions = () => {
    const optionsLoadedRef = useRef(false);
    const [types, setTypes] = useState<IWineType[]>([]);
    const [colors, setColors] = useState<IWineColor[]>([]);
    const [countries, setCountries] = useState<IWineChooserOption[]>([]);

    const loadBaseOptions = useCallback(async () => {
        if (optionsLoadedRef.current) {
            return;
        }

        const [typeResponse, colorResponse, countryResponse] = await Promise.all([
            wineService.getTypes(),
            wineService.getColors(),
            wineService.getWineChooserCountries(),
        ]);

        if (!typeResponse.isError && typeResponse.data) {
            setTypes(typeResponse.data);
        }

        if (!colorResponse.isError && colorResponse.data) {
            setColors(colorResponse.data);
        }

        if (!countryResponse.isError && countryResponse.data) {
            setCountries(countryResponse.data);
        }

        if (!typeResponse.isError && !colorResponse.isError && !countryResponse.isError) {
            optionsLoadedRef.current = true;
        }
    }, []);

    return {
        types,
        colors,
        countries,
        loadBaseOptions,
    };
};
