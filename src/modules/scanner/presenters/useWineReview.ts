import { FeaturesKeysEnum } from '@/entities/features/enums/FeaturesKeysEnum';
import { featuresModel } from '@/entities/features/FeaturesModel';
// import { wineModel } from '@/entities/wine/WineModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useWineReview = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [review, setReview] = useState('');
    const [isOpened, setIsOpened] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const isPremiumUser = useMemo(
        () => featuresModel.features?.find(feature => feature.key === FeaturesKeysEnum.TASTING_NOTES)?.isEnabled || false,
        [],
    );

    useEffect(() => {
        return () => {
            //TODO
            // wineModel.review = null;
        };
    }, []);

    const handleSliderChange = useCallback((value: number) => {
        setSliderValue(value);
    }, []);

    const onChangeReview = useCallback((text: string) => {
        setReview(text);
    }, []);

    const toggleNotes = useCallback(() => {
        setIsOpened(prevState => !prevState);
    }, []);

    const handleNextPress = useCallback(() => {
        // navigation.navigate('WineTasteCharacteristicsView');
    }, [navigation]);

    return { review, onChangeReview, handleSliderChange, handleNextPress, sliderValue, isPremiumUser, toggleNotes, isOpened };
};
