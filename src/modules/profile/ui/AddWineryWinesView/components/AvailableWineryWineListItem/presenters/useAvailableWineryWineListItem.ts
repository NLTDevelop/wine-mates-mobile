import { useCallback, useMemo } from 'react';
import { IAvailableWineryWine } from '@/entities/winery/types/IAvailableWineryWine';

interface IProps {
    item: IAvailableWineryWine;
    onPress: (item: IAvailableWineryWine) => void;
}

export const useAvailableWineryWineListItem = ({ item, onPress }: IProps) => {
    const imageUri = item.image?.mediumUrl || item.image?.originalUrl;
    const title = item.producer || item.name;
    const description = useMemo(() => {
        return [item.producer ? item.name : null, item.vintage].filter(Boolean).join(' · ');
    }, [item.name, item.producer, item.vintage]);
    const characteristics = useMemo(() => {
        return [item.grapeVariety, item.color.name, item.type.name].filter(Boolean).join(' · ');
    }, [item.color.name, item.grapeVariety, item.type.name]);
    const location = useMemo(() => {
        return [item.country.name, item.region?.name].filter(Boolean).join(', ');
    }, [item.country.name, item.region?.name]);
    const onItemPress = useCallback(() => {
        onPress(item);
    }, [item, onPress]);

    return {
        imageUri,
        title,
        description,
        characteristics,
        location,
        onItemPress,
    };
};
