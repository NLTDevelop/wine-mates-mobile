import { useMemo } from 'react';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';

interface IProps {
    item: IWineDetails | IWineListItem;
}

export const useWineDescription = ({ item }: IProps) => {
    const description = useMemo(() => {
        return [item.grapeVariety, item.name, item.type?.name, item.color?.name, item.country?.name, item.region?.name]
            .filter(Boolean)
            .join(', ');
    }, [item.type?.name, item.color?.name, item.country?.name, item.region?.name, item.grapeVariety, item.name]);

    return {
        description,
    };
};
