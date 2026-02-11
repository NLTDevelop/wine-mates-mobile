import { useCallback, useMemo, useState } from 'react';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { myWineListModel } from '@/entities/wine/MyWineListModel';

interface IWine {
    id: string;
    name: string;
    type: string;
    imageUrl: string;
    location: string;
    rating: number;
    reviewsCount: number;
}

export const useWineRecommendationCarousel = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

    const wines: IWine[] = useMemo(() => {
        const wineList = myWineListModel.list?.rows || [];
        
        return wineList.slice(0, 3).map((wine) => ({
            id: wine.id.toString(),
            name: `${wine.name}${wine.vintage ? ` ${wine.vintage}` : ''}`,
            type: wine.grapeVariety || 'Wine',
            imageUrl: wine.image?.mediumUrl|| '',
            location: wine.producer || '',
            rating: wine.averageUserRating || 0,
            reviewsCount: wine.countUserRating || 0,
        }));
    }, [myWineListModel.list]);

    const handleNext = useCallback(() => {
        setDirection('forward');
        setCurrentIndex((prev) => (prev + 1) % wines.length);
    }, [wines.length]);

    const handlePrevious = useCallback(() => {
        setDirection('backward');
        setCurrentIndex((prev) => (prev - 1 + wines.length) % wines.length);
    }, [wines.length]);

    return {
        styles,
        mockWines: wines,
        currentIndex,
        handleNext,
        handlePrevious,
        direction,
    };
};
