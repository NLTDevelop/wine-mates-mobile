/* eslint-disable react-hooks/set-state-in-effect */
import { userModel } from '@/entities/users/UserModel';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { Keyboard } from 'react-native';
import { ITasteCharacteristicDetail } from '@/entities/wine/types/ITasteCharacteristicDetail';
import { runInAction } from 'mobx';
import {
    getTasteCharacteristicsCache,
    setTasteCharacteristicsCache,
} from '@/libs/storage/cacheUtils';

const getTasteCharacteristicsCacheContext = (wineId?: number) => {
    return {
        wineId: wineId ?? wineModel.wine?.id ?? null,
        colorId: wineModel.base?.colorOfWine?.id ?? null,
        typeId: wineModel.base?.typeOfWine?.id ?? null,
    };
};

export const useWineTasteCharacteristics = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const source = (route.params as { source?: string } | undefined)?.source ?? 'scanner';
    const wineId = (route.params as { wineId?: number } | undefined)?.wineId;

    const [isLoading, setIsLoading] = useState(() => !wineModel.tasteCharacteristics?.length);
    const [isError, setIsError] = useState(false);
    const cacheContext = useMemo(() => getTasteCharacteristicsCacheContext(wineId), [wineId]);
    const [sliderValues, setSliderValues] = useState<Record<number, number>>(() => {
        return getTasteCharacteristicsCache(cacheContext) || {};
    });
    const [winePeak, setWinePeak] = useState<number | null>(wineModel.winePeak);

    const data = wineModel.tasteCharacteristics;

    const isPremiumUser = userModel.user?.hasPremium || false;
    const isExpertOrWinemaker = userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.EXPERT ||
        userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.CREATOR;

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
            setSliderValues(prev => Object.keys(prev).length === 0 ? prev : {});
            return;
        }

        const cachedValues = getTasteCharacteristicsCache(cacheContext);
        const next: Record<number, number> = {};

        data.forEach(item => {
            const maxIndex = Math.max((item.levels?.length ?? 0) - 1, 0);
            const cachedValue = cachedValues?.[item.id];
            const baseValue =
                typeof cachedValue === 'number'
                    ? cachedValue
                    : typeof item.selectedIndex === 'number'
                    ? item.selectedIndex
                    : 0;
            next[item.id] = Math.min(Math.max(baseValue, 0), maxIndex);
        });

        setSliderValues(prev => {
            const hasChanges = Object.keys(next).some(key => prev[Number(key)] !== next[Number(key)]) ||
                               Object.keys(prev).length !== Object.keys(next).length;
            return hasChanges ? next : prev;
        });

        const nextTasteCharacteristics = data.map(item => ({
            ...item,
            selectedIndex: next[item.id] ?? item.selectedIndex ?? 0,
        }));
        const hasModelChanges = nextTasteCharacteristics.some(item => {
            const currentItem = data.find(characteristic => characteristic.id === item.id);
            return currentItem?.selectedIndex !== item.selectedIndex;
        });

        if (hasModelChanges) {
            runInAction(() => {
                wineModel.tasteCharacteristics = nextTasteCharacteristics;
            });
        }
    }, [cacheContext, data]);

    const saveCharacteristicDetails = useCallback((sliderVals: Record<number, number>) => {
        if (!data?.length) return;

        const hasPremiumAccess = userModel.user?.hasPremium || false;
        const available = hasPremiumAccess
            ? data
            : data.filter(c => !c.isPremium);

        const details: ITasteCharacteristicDetail[] = available
            .map(item => ({
                id: item.id,
                label: item.name,
                value: item.levels[sliderVals[item.id] ?? 0]?.name || '',
            }))
            .filter(detail => detail.value);

        runInAction(() => {
            wineModel.tasteCharacteristicDetails = details;
        });
    }, [data]);

    const onSliderChange = useCallback(
        (id: number, value: number) => {
            setSliderValues(prev => {
                const characteristic = data?.find(c => c.id === id);
                const levelsLength = characteristic?.levels.length ?? 0;
                const maxIndex = Math.max(levelsLength - 1, 0);
                const nextValue = Math.min(Math.max(value, 0), maxIndex);
                const next = { ...prev, [id]: nextValue };

                if (data?.length) {
                    runInAction(() => {
                        wineModel.tasteCharacteristics = data.map(item => ({
                            ...item,
                            selectedIndex: next[item.id] ?? item.selectedIndex ?? 0,
                        }));
                    });
                }

                setTasteCharacteristicsCache(cacheContext, next);
                saveCharacteristicDetails(next);

                return next;
            });
            Keyboard.dismiss();
        },
        [cacheContext, data, saveCharacteristicDetails],
    );
    const createOnSliderChange = useCallback((id: number) => {
        return (value: number) => {
            onSliderChange(id, value);
        };
    }, [onSliderChange]);

    const onWinePeakChange = useCallback((year: number | null) => {
        setWinePeak(year);
        runInAction(() => {
            wineModel.winePeak = year;
        });
        Keyboard.dismiss();
    }, []);

    const onPressNext = useCallback(() => {
        runInAction(() => {
            if (data) {
                wineModel.tasteCharacteristics = data.map(item => ({
                    ...item,
                    selectedIndex: sliderValues[item.id] ?? 0,
                }));
            }

            if (winePeak) {
                wineModel.winePeak = winePeak;
            }
        });
        setTasteCharacteristicsCache(cacheContext, sliderValues);

        navigation.navigate('WineReviewView', { isFullTastingReview: true, source, wineId });
        Keyboard.dismiss();
    }, [cacheContext, data, navigation, sliderValues, winePeak, source, wineId]);

    return {
        data,
        isError,
        getTasteCharacteristics,
        onSliderChange,
        createOnSliderChange,
        isLoading,
        onPressNext,
        sliderValues,
        isPremiumUser,
        winePeak,
        onWinePeakChange,
        isExpertOrWinemaker,
    };
};
