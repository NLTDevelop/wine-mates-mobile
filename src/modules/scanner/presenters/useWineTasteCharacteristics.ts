import { FeaturesKeysEnum } from '@/entities/features/enums/FeaturesKeysEnum';
import { featuresModel } from '@/entities/features/FeaturesModel';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useWineTasteCharacteristics = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [sliderValues, setSliderValues] = useState<Record<number, number>>({});
    const data = wineModel.tasteCharacteristics;
    const isPremiumUser = useMemo(
        () => featuresModel.features?.find(feature => feature.key === FeaturesKeysEnum.TASTING_NOTES)?.isEnabled || false,
    []);

    const getTasteCharacteristics = useCallback(async () => {
        try {
            if (!wineModel.base?.colorOfWine?.id) return;

            setIsLoading(true);

            const params = {
                colorId: wineModel.base?.colorOfWine.id,
            };

            const response = await wineService.getTastesCharacteristics(params);

            if (response.isError || !response.data) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError(true);
                }
            } else {
                setIsError(false);
            }
        } catch (error) {
            console.error('getTasteCharacteristics error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getTasteCharacteristics();
    }, [getTasteCharacteristics]);

    useEffect(() => {
        if (!data || data.length === 0) {
            setSliderValues({});
            return;
        }

        setSliderValues(prev => {
            const next: Record<number, number> = {};

            data.forEach(item => {
                const maxIndex = Math.max((item.levels?.length ?? 0) - 1, 0);
                const baseValue =
                    typeof item.selectedIndex === 'number' ? item.selectedIndex : prev[item.id] ?? 0;
                next[item.id] = Math.min(Math.max(baseValue, 0), maxIndex);
            });

            return next;
        });
    }, [data]);

    useEffect(() => {
        return () => {
            wineModel.tasteCharacteristics = null;
        };
    }, []);

    const handleSliderChange = useCallback(
        (id: number, value: number) => {
            setSliderValues(prev => {
                const levelsLength = data?.find(characteristic => characteristic.id === id)?.levels.length ?? 0;
                const maxIndex = Math.max(levelsLength - 1, 0);
                const nextValue = Math.min(Math.max(value, 0), maxIndex);

                return { ...prev, [id]: nextValue };
            });
        },
        [data],
    );

    const handleNextPress = useCallback(() => {
        if (data) {
            wineModel.tasteCharacteristics = data.map(item => ({
                ...item,
                selectedIndex: sliderValues[item.id] ?? 0,
            }));
        }

        navigation.navigate('WineReviewView');
    }, [data, navigation, sliderValues]);

    return { data, isError, getTasteCharacteristics, handleSliderChange, isLoading, handleNextPress, sliderValues, isPremiumUser };
};
