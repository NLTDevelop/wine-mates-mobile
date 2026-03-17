import { wineModel } from '@/entities/wine/WineModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';

export const useWineReview = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [review, setReview] = useState(() => wineModel.review?.review ?? '');
    const [sliderValue, setSliderValue] = useState(() => wineModel.review?.rate ?? 70);
    const [starRate, setStarRate] = useState(() => wineModel.review?.starRate ?? 0);
    const [hasChangedRate, setHasChangedRate] = useState(() => wineModel.review?.hasChangedRate ?? false);
    const [hasChangedStarRate, setHasChangedStarRate] = useState(() => wineModel.review?.hasChangedStarRate ?? false);

    const handleSliderChange = useCallback((value: number) => {
        setSliderValue(value);
        setHasChangedRate(true);
    }, []);

    const onChangeReview = useCallback((text: string) => {
        setReview(text);
    }, []);

    const onStarRateChange = useCallback((value: number) => {
        const newValue = Number(value.toFixed(1));
        setStarRate(prev => prev === newValue ? prev : newValue);
        setHasChangedStarRate(true);
    }, []);

    const handleNextPress = useCallback(() => {
        wineModel.review = {
            ...(wineModel.review || { review: '' }),
            starRate,
            rate: sliderValue,
            review,
            hasChangedRate,
            hasChangedStarRate,
        };
        navigation.navigate('WineReviewResultView');
    }, [navigation, review, sliderValue, starRate, hasChangedRate, hasChangedStarRate]);

    return { review, onChangeReview, handleSliderChange, handleNextPress, sliderValue, starRate, onStarRateChange };
};
