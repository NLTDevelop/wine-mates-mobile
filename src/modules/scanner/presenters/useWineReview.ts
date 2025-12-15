import { wineModel } from '@/entities/wine/WineModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';

export const useWineReview = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [review, setReview] = useState('');
    const [sliderValue, setSliderValue] = useState(0);
    const [starRate, setStarRate] = useState(0);

    useEffect(() => {
        return () => {
            wineModel.review = null;
        };
    }, []);

    const handleSliderChange = useCallback((value: number) => {
        setSliderValue(value);
    }, []);

    const onChangeReview = useCallback((text: string) => {
        setReview(text);
    }, []);

    const onStarRateChange = useCallback((value: number) => {
        setStarRate(value);
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
