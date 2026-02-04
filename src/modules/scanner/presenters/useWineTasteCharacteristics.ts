import { userModel } from '@/entities/users/UserModel';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { storage } from '@/libs/storage/MMKVStorage';
import { TASTE_CHARACTERISTICS_CACHE_KEY } from '@/libs/storage/cacheUtils';

export const useWineTasteCharacteristics = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const [isLoading, setIsLoading] = useState(() => !wineModel.tasteCharacteristics?.length);
    const [isError, setIsError] = useState(false);
    const [sliderValues, setSliderValues] = useState<Record<number, number>>(() => {
        const cached = storage.get(TASTE_CHARACTERISTICS_CACHE_KEY);
        return cached || {};
    });
    const data = wineModel.tasteCharacteristics;

    const isPremiumUser = userModel.user?.hasPremium || false;

    const getTasteCharacteristics = useCallback(async () => {
        try {
            if (!wineModel.base?.colorOfWine?.id || !wineModel.base?.typeOfWine?.id) return;

            if (wineModel.tasteCharacteristics?.length) {
                setIsError(false);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            const params = {
                colorId: wineModel.base?.colorOfWine.id,
                typeId: wineModel.base?.typeOfWine.id,
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

        const cached = storage.get(TASTE_CHARACTERISTICS_CACHE_KEY) || {};
        const next: Record<number, number> = {};

        data.forEach(item => {
            const maxIndex = Math.max((item.levels?.length ?? 0) - 1, 0);
            const cachedValue = cached[item.id];
            const baseValue =
                cachedValue !== undefined
                    ? cachedValue
                    : typeof item.selectedIndex === 'number'
                    ? item.selectedIndex
                    : 0;
            next[item.id] = Math.min(Math.max(baseValue, 0), maxIndex);
        });

        setSliderValues(next);
    }, [data]);

    const handleSliderChange = useCallback(
        (id: number, value: number) => {
            setSliderValues(prev => {
                const characteristic = data?.find(c => c.id === id);
                const levelsLength = characteristic?.levels.length ?? 0;
                const maxIndex = Math.max(levelsLength - 1, 0);
                const nextValue = Math.min(Math.max(value, 0), maxIndex);
                const next = { ...prev, [id]: nextValue };

                storage.set(TASTE_CHARACTERISTICS_CACHE_KEY, next);

                if (data?.length) {
                    wineModel.tasteCharacteristics = data.map(item => ({
                        ...item,
                        selectedIndex: next[item.id] ?? item.selectedIndex ?? 0,
                    }));
                }

                return next;
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
