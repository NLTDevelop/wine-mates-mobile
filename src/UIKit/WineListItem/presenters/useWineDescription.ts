import { useMemo } from 'react';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';

interface IProps {
    item: IWineDetails | IWineListItem;
    showVintage?: boolean;
}

const isWineDetails = (item: IWineDetails | IWineListItem): item is IWineDetails => 'currentVintage' in item;

export const useWineDescription = ({ item, showVintage = false }: IProps) => {
    const description = useMemo(() => {
        const parts = [item.grapeVariety, item.name, item.type?.name, item.color?.name, item.country?.name, item.region?.name];
        
        if (showVintage) {
            const vintageYear = isWineDetails(item) && typeof item.currentVintage === 'object' && item.currentVintage !== null
                ? item.currentVintage.vintage
                : item.vintage;
            
            if (vintageYear) {
                parts.push(String(vintageYear));
            }
        }
        
        return parts.filter(Boolean).join(', ');
    }, [item, showVintage]);

    return {
        description,
    };
};
