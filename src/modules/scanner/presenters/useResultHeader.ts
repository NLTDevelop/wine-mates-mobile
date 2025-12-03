import { IVintage } from '@/entities/wine/types/IWineDetails';
import { useCallback, useMemo } from 'react';

export const useResultHeader = (vintages: IVintage[]) => {
    const vintageData = useMemo(() =>
        vintages.map((vintage: IVintage) => {
            const label = String(vintage.vintage);
            return {
                label,
                value: label,
                id: vintage.wineId,
            };
        }),
    [vintages]);

    const onPress = useCallback(() => {

    }, []); 
    
    const onFavoritePress = useCallback(() => {

    }, []); 

    return { vintageData, onPress, onFavoritePress };
};
