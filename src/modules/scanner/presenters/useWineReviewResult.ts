import { FeaturesKeysEnum } from '@/entities/features/enums/FeaturesKeysEnum';
import { featuresModel } from '@/entities/features/FeaturesModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useWineReviewResult = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isOpened, setIsOpened] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const isPremiumUser = useMemo(
        () => featuresModel.features?.find(feature => feature.key === FeaturesKeysEnum.TASTING_NOTES)?.isEnabled || false,
        [],
    );

    const toggleNotes = useCallback(() => {
        setIsOpened(prevState => !prevState);
    }, []);

    const getNotes = useCallback(async () => {
        try {
            setIsLoading(true);

            // const payload = {
            //     colorId: wineModel.base?.colorOfWine.id,
            // };

            // const response = await wineService.getSmells(payload);

            // if (response.isError || !response.data) {
            //     if (response.message) {
            //         toastService.showError(localization.t('common.errorHappened'), response.message);
            //         setIsError(true);
            //     }
            // } else {
            //     setIsError(false);
            // }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getNotes();
    }, [getNotes]);

    const handleSavePress = useCallback(async () => {
        try {
            setIsSaving(true);

            // const payload = {
            //     colorId: wineModel.base?.colorOfWine.id,
            // };

            // const response = await wineService.getSmells(payload);

            // if (response.isError || !response.data) {
            //     if (response.message) {
            //         toastService.showError(localization.t('common.errorHappened'), response.message);
            //         setIsError(true);
            //     }
            // } else {
            //     setIsError(false);
            // }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsSaving(false);
        }
        // navigation.navigate('WineReviewResultView');
    }, [navigation]);

    return { 
        handleSavePress, isPremiumUser, toggleNotes, isOpened, isError, getNotes, isLoading, isSaving
    };
};
