import { useCallback } from 'react';
import { IWineSetItem } from '@/entities/events/types/IWineSetItem';

interface IUseWineSetItemProps {
    item: IWineSetItem;
}

export const useWineSetItem = ({ item }: IUseWineSetItemProps) => {
    const producerPrefix = item.wine.producer ? `${item.wine.producer}, ` : '';
    const vintageSuffix = item.wine.vintage ? ` ${item.wine.vintage}` : '';
    const title = `${producerPrefix}${item.wine.name}${vintageSuffix}`;
    const imageUrl = item.wine.image?.smallUrl || item.wine.image?.mediumUrl || item.wine.image?.originalUrl || '';

    const onPress = useCallback(() => {}, []);

    return {
        title,
        imageUrl,
        onPress,
    };
};
