import { useMemo } from 'react';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useUiContext } from '@/UIProvider';

interface IProps {
    item: IWineDetails | IWineListItem;
    showVintage?: boolean;
    showNonVintage?: boolean;
}

const isWineDetails = (item: IWineDetails | IWineListItem): item is IWineDetails => 'currentVintage' in item;

export const useWineDescription = ({ item, showVintage = false, showNonVintage = false }: IProps) => {
    const { t } = useUiContext();
    
    const description = useMemo(() => {
        const parts = [item.grapeVariety, item.name, item.type?.name, item.color?.name, item.country?.name, item.region?.name];
        
        if (showVintage) {
            const vintageYear = isWineDetails(item) && typeof item.currentVintage === 'object' && item.currentVintage !== null
                ? item.currentVintage.vintage
                : item.vintage;
            
            if (vintageYear) {
                parts.push(String(vintageYear));
            } else if (showNonVintage) {
                parts.push(t('wine.nonVintage'));
            }
        }
        
        return parts.filter(Boolean).join(', ');
    }, [item, showVintage, showNonVintage, t]);

    return {
        description,
    };
};
