import { wineModel } from '@/entities/wine/WineModel';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { useWineRateSubmit } from '@/modules/scanner/presenters/useWineRateSubmit';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { Keyboard } from 'react-native';
import { runInAction } from 'mobx';

type WineReviewRouteParams = {
    isFullTastingReview?: boolean;
    source?: string;
    wineId?: number;
};

export const useWineReview = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const params = route.params as WineReviewRouteParams | undefined;
    const isFullTastingReview = params?.isFullTastingReview || false;
    const source = params?.source ?? 'scanner';
    const wineId = params?.wineId;
    const { saveWineRate } = useWineRateSubmit();
    const [review, setReview] = useState(() => wineModel.review?.review ?? '');
    const [sliderValue, setSliderValue] = useState(() => wineModel.review?.rate ?? 70);
    const [starRate, setStarRate] = useState(() => wineModel.review?.starRate ?? 0);
    const [winePeak, setWinePeak] = useState<number | null>(wineModel.winePeak);
    const [hasChangedRate, setHasChangedRate] = useState(() => wineModel.review?.hasChangedRate ?? false);
    const [hasChangedStarRate, setHasChangedStarRate] = useState(() => wineModel.review?.hasChangedStarRate ?? false);
    const [isSaving, setIsSaving] = useState(false);
    const isExpertOrWinemaker = userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.EXPERT ||
        userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.CREATOR;
    const isWinePeakPickerVisible = isExpertOrWinemaker && !isFullTastingReview;

    const onSliderChange = useCallback((value: number) => {
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

    const onWinePeakChange = useCallback((year: number | null) => {
        setWinePeak(year);
        runInAction(() => {
            wineModel.winePeak = year;
        });
        Keyboard.dismiss();
    }, []);

    const saveReview = useCallback(() => {
        wineModel.review = {
            ...(wineModel.review || { review: '' }),
            starRate,
            rate: sliderValue,
            review,
            hasChangedRate,
            hasChangedStarRate,
        };
    }, [review, sliderValue, starRate, hasChangedRate, hasChangedStarRate]);

    const onContinueFullTastingPress = useCallback(() => {
        saveReview();
        navigation.navigate('WineLookView', { source, wineId });
    }, [navigation, saveReview, source, wineId]);

    const onResultPress = useCallback(() => {
        saveReview();
        navigation.navigate('WineReviewResultView');
    }, [navigation, saveReview]);

    const onFinishTastingPress = useCallback(async () => {
        try {
            setIsSaving(true);
            saveReview();
            await saveWineRate({ isFullTasting: false });
        } finally {
            setIsSaving(false);
        }
    }, [saveReview, saveWineRate]);

    return {
        review,
        onChangeReview,
        onSliderChange,
        onContinueFullTastingPress,
        onFinishTastingPress,
        onResultPress,
        sliderValue,
        starRate,
        winePeak,
        onStarRateChange,
        onWinePeakChange,
        isSaving,
        isFullTastingReview,
        isWinePeakPickerVisible,
    };
};
