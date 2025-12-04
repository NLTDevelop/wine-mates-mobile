import { IVintage, IWineDetails } from '@/entities/wine/types/IWineDetails';
import { useCallback, useMemo } from 'react';

export const useResultHeader = (item: IWineDetails) => {
    const vintageData = useMemo(() =>
        item.vintages.map((vintage: IVintage) => {
            const label = String(vintage.vintage);
            return {
                label,
                value: label,
                id: vintage.wineId,
            };
        }),
    [item]);

    const onPress = useCallback(() => {

    }, []); 
    
    const onFavoritePress = useCallback(() => {

    }, []); 

    return { vintageData, onPress, onFavoritePress };
};
