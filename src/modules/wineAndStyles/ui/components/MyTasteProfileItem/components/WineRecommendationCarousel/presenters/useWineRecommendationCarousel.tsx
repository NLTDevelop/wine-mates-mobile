import { useCallback, useRef, useState } from 'react';
import { wineAndStylesModel } from '@/entities/wine/WineAndStylesModel';
import { wineService } from '@/entities/wine/WineService';

const LIMIT = 10;
const PREFETCH_THRESHOLD = 8;

interface IUseWineRecommendationCarouselParams {
    typeId: number;
    colorId: number;
}

export const useWineRecommendationCarousel = ({ typeId, colorId }: IUseWineRecommendationCarouselParams) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const isFetchingRef = useRef(false);

    const key = wineAndStylesModel.getRecommendationKey(typeId, colorId);
    const wines = wineAndStylesModel.recommendations[key] ?? [];
    const pagination = wineAndStylesModel.recommendationsPagination[key];

    const fetchNextPage = useCallback(async () => {
        if (!pagination || isFetchingRef.current) {
            return;
        }

        const nextPage = pagination.page + 1;

        if (nextPage > pagination.totalPages) {
            return;
        }

        isFetchingRef.current = true;

        const response = await wineService.getRecommendations({
            typeId,
            colorId,
            page: nextPage,
            limit: LIMIT,
        });

        if (!response.isError && response.data) {
            wineAndStylesModel.appendRecommendations(key, response.data.rows, nextPage);
        }

        isFetchingRef.current = false;
    }, [key, typeId, colorId, pagination]);

    const handleNext = useCallback(() => {
        setDirection('forward');
        setCurrentIndex((prev) => {
            const next = (prev + 1) % wines.length;

            if (wines.length - next <= PREFETCH_THRESHOLD) {
                fetchNextPage();
            }

            return next;
        });
    }, [wines.length, fetchNextPage]);

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
    };
};
