import { useCallback, useEffect, useState } from 'react';
import { wineService } from '@/entities/wine/WineService';
import { wineListsModel } from '@/entities/wine/WineListsModel';

export const useWineRecommendationCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [isLoading, setIsLoading] = useState(true);

    const wines = wineListsModel.recommendations?.rows || [];

    useEffect(() => {
        const fetchRecommendations = async () => {
            setIsLoading(true);
            await wineService.getRecommendations();
            setIsLoading(false);
        };

        fetchRecommendations();
    }, []);

    const handleNext = useCallback(() => {
        setDirection('forward');
        setCurrentIndex((prev) => (prev + 1) % wines.length);
    }, [wines.length]);

    const handlePrevious = useCallback(() => {
        setDirection('backward');
        setCurrentIndex((prev) => (prev - 1 + wines.length) % wines.length);
    }, [wines.length]);

    return {
        wines,
        currentIndex,
        handleNext,
        handlePrevious,
        direction,
        isLoading,
    };
};
