import { FeaturesKeysEnum } from '@/entities/features/enums/FeaturesKeysEnum';
import { featuresModel } from '@/entities/features/FeaturesModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { userModel } from '@/entities/users/UserModel';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { AddRateDto } from '@/entities/wine/dto/AddRate.dto';
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
            setIsError(false);
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

            const available = isPremiumUser
                ? wineModel.tasteCharacteristics
                : wineModel.tasteCharacteristics?.filter(item => !item.isPremium);

            const aromas = wineModel.selectedSmells?.filter(item => item.aroma?.colorHex)
            ?.map(item => item.aroma?.id || 0);
            const suggestedAromas = wineModel.selectedSmells?.filter(item => !item.aroma?.colorHex)
            ?.map(item => item.aroma?.name || '');

            const flavors = wineModel.selectedTastes?.filter(item => item.colorHex)?.map(item => item.id);
            const suggestedFlavors = wineModel.selectedTastes?.filter(item => !item.colorHex)?.map(item => item.name || '');

            const payload: AddRateDto = {
                wineId: wineModel.wine?.id || 0,
                review: wineModel.review?.review || '',
                color: {
                    colorId: wineModel.look?.colorId || 0,
                    shadeId: wineModel.look?.shadeId || 0,
                    tone: wineModel.look?.tone || '',
                },
                aromas: aromas || [],
                flavors: flavors || [],
                tasteCharacteristics: available?.map(item => ({
                    characteristicId: item.id,
                    levelId: item.levels[(item.selectedLevel ?? 0)]?.id || 0,
                })) || [],
            };

            if (userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.LOVER) {
                payload.userRating = wineModel.review?.starRate;
            } else {
                payload.expertRating = wineModel.review?.rate;
            }

            if (wineModel.base?.typeOfWine.isSparkling) {
                payload.color = {
                    ...payload.color,
                    mousse:  wineModel.look?.mousse || 0,
                    perlage:  wineModel.look?.perlage || 0,
                    appearance:  wineModel.look?.appearance || 0,
                }
            }

            const hasSuggestedAromas = (suggestedAromas?.length ?? 0) > 0;
            const hasSuggestedFlavors = (suggestedFlavors?.length ?? 0) > 0;

            if (hasSuggestedAromas || hasSuggestedFlavors) {
                payload.suggestions = {};

                if (hasSuggestedAromas) {
                    payload.suggestions.aromas = suggestedAromas;
                }

                if (hasSuggestedFlavors) {
                    payload.suggestions.flavors = suggestedFlavors;
                }
            }

            const response = await wineService.addToRate(payload);

            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            } else {
                // navigation.navigate('ScanResultView');
                toastService.showSuccess('Сохранилось!', 'В дальнейшем будет навигация');
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsSaving(false);
        }
    }, [navigation, isPremiumUser]);

    return { 
        handleSavePress, isPremiumUser, toggleNotes, isOpened, isError, getNotes, isLoading, isSaving
    };
};
