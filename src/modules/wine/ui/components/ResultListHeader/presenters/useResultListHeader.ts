/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { snackService } from '@/entities/snacks/SnackService';
import { ISnack } from '@/entities/snacks/types/ISnack';
import { IWineSnackCuisine } from '@/entities/snacks/types/IWineSnackCuisine';
import { IWineSnackCuisineOption } from '@/entities/snacks/types/IWineSnackCuisineOption';
import { IWineDetails, IVintagesItem } from '@/entities/wine/types/IWineDetails';
import {
    getWineSnackCuisinesCache,
    IWineSnackCuisineCacheItem,
    setWineSnackCuisinesCache,
} from '@/libs/storage/cacheUtils';
import { toastService } from '@/libs/toast/toastService';
import { useColorShades } from '@/modules/wine/presenters/useColorShades';
import { localization } from '@/UIProvider/localization/Localization';
import { MAX_FOOD_PAIRING_CUISINES } from '@/entities/snacks/constants';
import { getHasDetailedTasting } from '@/modules/wine/presenters/getHasDetailedTasting';

export const useResultListHeader = (data: IWineDetails, vintages: IVintagesItem[]) => {
    const [aiUsage, setAiUsage] = useState(data.aiUsage);
    const [snacks, setSnacks] = useState<ISnack[] | null>(data.aiSnacks || null);
    const [isGeneratingSnacks, setIsGeneratingSnacks] = useState(false);
    const [isCuisineModalVisible, setIsCuisineModalVisible] = useState(false);
    const [isLoadingCuisines, setIsLoadingCuisines] = useState(false);
    const [cuisines, setCuisines] = useState<IWineSnackCuisine[]>([]);
    const [selectedCuisineItems, setSelectedCuisineItems] = useState<IWineSnackCuisineCacheItem[]>(() => {
        return (getWineSnackCuisinesCache(data.id) || []).slice(0, MAX_FOOD_PAIRING_CUISINES);
    });
    const { colorShadeItems } = useColorShades(data.statistics.topColors);
    const isFoodPairingVisible = useMemo(() => getHasDetailedTasting(data), [data]);

    const tasteCharacteristics = useMemo(() => {
        return data.statistics.tasteCharacteristics?.filter(item => item?.levels && item?.selectedIndex != null) ?? [];
    }, [data.statistics.tasteCharacteristics]);

    const isVintageTasted = useMemo(() => {
        if (!data.isTasted) return false;
        if (data.vintage === null) return true;

        const isInVintages = vintages.some(vintage => {
            if (typeof vintage === 'number') return vintage === data.vintage;
            if (typeof vintage === 'string') {
                const parsedValue = Number(vintage);
                return !Number.isNaN(parsedValue) && parsedValue === data.vintage;
            }

            return vintage.vintage === data.vintage;
        });
        const isCurrentVintage =
            typeof data.currentVintage === 'object' &&
            data.currentVintage !== null &&
            data.currentVintage.vintage === data.vintage;

        return isInVintages || isCurrentVintage;
    }, [data.currentVintage, data.isTasted, data.vintage, vintages]);

    const selectedCuisineIds = useMemo(() => {
        return selectedCuisineItems.map(item => item.id);
    }, [selectedCuisineItems]);

    const selectedCuisineNames = useMemo(() => {
        if (cuisines.length === 0) {
            return selectedCuisineItems.map(item => item.name);
        }

        return selectedCuisineIds
            .map(id => cuisines.find(item => item.id === id)?.name)
            .filter((name): name is string => Boolean(name));
    }, [cuisines, selectedCuisineIds, selectedCuisineItems]);

    const cuisineSelectButtonText = useMemo(() => {
        if (selectedCuisineNames.length === 0) {
            return localization.t('wine.snackCuisines');
        }

        return selectedCuisineNames.join(', ');
    }, [selectedCuisineNames]);

    useEffect(() => {
        setSnacks(data.aiSnacks || null);
        setAiUsage(data.aiUsage);
        setIsGeneratingSnacks(false);
    }, [data.aiSnacks, data.aiUsage, data.id, data.vintage]);

    useEffect(() => {
        setIsCuisineModalVisible(false);
        setSelectedCuisineItems(
            (getWineSnackCuisinesCache(data.id) || []).slice(0, MAX_FOOD_PAIRING_CUISINES),
        );
        setCuisines([]);
    }, [data.id, data.vintage]);

    const loadCuisines = useCallback(async () => {
        try {
            setIsLoadingCuisines(true);
            const response = await snackService.getWineSnackCuisines();

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            setCuisines(response.data);
        } catch (error) {
            console.error('loadCuisines error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsLoadingCuisines(false);
        }
    }, []);

    const onOpenCuisinePickerPress = useCallback(() => {
        setIsCuisineModalVisible(true);

        if (cuisines.length === 0) {
            loadCuisines();
        }
    }, [cuisines.length, loadCuisines]);

    const onCloseCuisinePicker = useCallback(() => {
        setIsCuisineModalVisible(false);
    }, []);

    const onToggleCuisine = useCallback(
        (id: number) => {
            setSelectedCuisineItems(prevState => {
                if (prevState.some(item => item.id === id)) {
                    const nextState = prevState.filter(item => item.id !== id);
                    setWineSnackCuisinesCache(data.id, nextState);
                    return nextState;
                }

                const cuisine = cuisines.find(item => item.id === id);

                if (!cuisine || prevState.length >= MAX_FOOD_PAIRING_CUISINES) return prevState;

                const nextState = [...prevState, { id: cuisine.id, name: cuisine.name }];
                setWineSnackCuisinesCache(data.id, nextState);
                return nextState;
            });
        },
        [cuisines, data.id],
    );

    const cuisineOptions = useMemo<IWineSnackCuisineOption[]>(() => {
        return cuisines.map(item => {
            const isSelected = selectedCuisineIds.includes(item.id);

            return {
                id: item.id,
                name: item.name,
                isSelected,
                isDisabled: selectedCuisineIds.length >= MAX_FOOD_PAIRING_CUISINES && !isSelected,
                onPress: () => onToggleCuisine(item.id),
            };
        });
    }, [cuisines, onToggleCuisine, selectedCuisineIds]);

    const onConfirmCuisineSelection = useCallback(() => {
        setIsCuisineModalVisible(false);
    }, []);

    const onGenerateSnacksPress = useCallback(async () => {
        try {
            setIsGeneratingSnacks(true);
            const response = await snackService.generateWineSnacks({
                wineId: data.id,
                cuisines: selectedCuisineNames,
            });

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            const generatedSnacks = Array.isArray(response.data.snacks) ? response.data.snacks : [response.data.snacks];
            setSnacks(generatedSnacks);
            setAiUsage(prevState => {
                return {
                    ...prevState,
                    left: Math.max(0, prevState.left - 1),
                };
            });
        } catch (error) {
            console.error('onGenerateSnacksPress error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsGeneratingSnacks(false);
        }
    }, [data.id, selectedCuisineNames]);

    const onSubscribePress = useCallback(() => {}, []);

    return {
        colorShadeItems,
        tasteCharacteristics,
        isVintageTasted,
        isFoodPairingVisible,
        aiUsage,
        snacks,
        isGeneratingSnacks,
        isCuisineModalVisible,
        isLoadingCuisines,
        cuisineOptions,
        cuisineSelectButtonText,
        onOpenCuisinePickerPress,
        onCloseCuisinePicker,
        onConfirmCuisineSelection,
        onGenerateSnacksPress,
        onSubscribePress,
    };
};
