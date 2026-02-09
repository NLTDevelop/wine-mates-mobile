import { wineModel } from '@/entities/wine/WineModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';

export const useWineReview = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [review, setReview] = useState(() => wineModel.review?.review ?? '');
    const [sliderValue, setSliderValue] = useState(() => wineModel.review?.rate ?? 70);
    const [starRate, setStarRate] = useState(() => wineModel.review?.starRate ?? 0);

    const handleSliderChange = useCallback((value: number) => {
        setSliderValue(value);
    }, []);

    const onChangeReview = useCallback((text: string) => {
        setReview(text);
    }, []);

    const onStarRateChange = useCallback((value: number) => {
        const newValue = Number(value.toFixed(1));
        setStarRate(prev => prev === newValue ? prev : newValue);
    }, []);

    const handleNextPress = useCallback(() => {
        wineModel.review = {
            starRate,
            rate: sliderValue,
            review,
        };
        navigation.navigate('WineReviewResultView');
    }, [navigation, review, sliderValue, starRate]);

    return { review, onChangeReview, handleSliderChange, handleNextPress, sliderValue, starRate, onStarRateChange };
};
