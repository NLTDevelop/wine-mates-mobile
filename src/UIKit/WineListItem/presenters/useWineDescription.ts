import { useMemo } from 'react';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';

interface IProps {
    item: IWineDetails | IWineListItem;
}

const isWineDetails = (item: IWineDetails | IWineListItem): item is IWineDetails => 'currentVintage' in item;

export const useWineDescription = ({ item }: IProps) => {
    const description = useMemo(() => {
        const parts = [item.grapeVariety, item.name, item.type?.name, item.color?.name, item.country?.name, item.region?.name];
        
        const vintageYear = isWineDetails(item) && typeof item.currentVintage === 'object' && item.currentVintage !== null
            ? item.currentVintage.year
            : item.year;
        
        if (vintageYear) {
            parts.push(String(vintageYear));
        }
        
        return parts.filter(Boolean).join(', ');
    }, [item]);

    return {
        description,
    };
};
