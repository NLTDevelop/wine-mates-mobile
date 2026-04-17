import { useCallback, useRef } from 'react';
import { wineAndStylesModel } from '@/entities/wine/WineAndStylesModel';
import { wineService } from '@/entities/wine/WineService';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';

const LIMIT = 10;
const PREFETCH_THRESHOLD = 8;

interface IUseWineRecommendationCarouselParams {
    typeId: number;
    colorId: number;
}

export const useWineRecommendationCarousel = ({ typeId, colorId }: IUseWineRecommendationCarouselParams) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const carouselRef = useRef<ICarouselInstance>(null);
    const isFetchingRef = useRef(false);

    const key = wineAndStylesModel.getRecommendationKey(typeId, colorId);
    const wines = wineAndStylesModel.recommendations[key] ?? [];
    const pagination = wineAndStylesModel.recommendationsPagination[key];

    const onWinePress = useCallback((item: IWineListItem) => {
        navigation.navigate('WineDetailsView', { wineId: item.id });
    }, [navigation]);

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

    const onSnapToItem = useCallback((index: number) => {
        if (wines.length - index <= PREFETCH_THRESHOLD) {
            fetchNextPage();
        }
    }, [wines.length, fetchNextPage]);

    const onNext = useCallback(() => {
        carouselRef.current?.next();
    }, []);

    const onPrevious = useCallback(() => {
        carouselRef.current?.prev();
    }, []);

    return {
        wines,
        carouselRef,
        onSnapToItem,
        onWinePress,
        onNext,
        onPrevious
    };
};
