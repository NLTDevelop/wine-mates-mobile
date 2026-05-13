import { useCallback } from 'react';
import { IWineSetItem } from '@/entities/events/types/IWineSetItem';

interface IUseWineSetItemProps {
    item: IWineSetItem;
    isBlindTasting: boolean;
    wineOrder: number;
}

export const useWineSetItem = ({ item, isBlindTasting, wineOrder }: IUseWineSetItemProps) => {
    const producerPrefix = item.wine.producer ? `${item.wine.producer}, ` : '';
    const vintageSuffix = item.wine.vintage ? ` ${item.wine.vintage}` : '';
    const defaultTitle = `${producerPrefix}${item.wine.name}${vintageSuffix}`;
    const defaultImageUrl = item.wine.image?.smallUrl || item.wine.image?.mediumUrl || item.wine.image?.originalUrl || '';
    const title = isBlindTasting ? `Wine ${wineOrder}` : defaultTitle;
    const imageUrl = isBlindTasting ? '' : defaultImageUrl;
    const isImageVisible = !isBlindTasting;

    const onPress = useCallback(() => {}, []);

    return {
        title,
        imageUrl,
        isImageVisible,
        onPress,
    };
};
