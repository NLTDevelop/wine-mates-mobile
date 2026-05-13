/* eslint-disable react-hooks/set-state-in-effect */
import { userModel } from '@/entities/users/UserModel';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { eventTastingService } from '@/entities/events/EventTastingService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { Keyboard } from 'react-native';
import { ITasteCharacteristicDetail } from '@/entities/wine/types/ITasteCharacteristicDetail';
import { runInAction } from 'mobx';
import { useEventTastingDraft } from '@/modules/tastings/presenters/useEventTastingDraft';
import type { AddRateDto } from '@/entities/wine/dto/AddRate.dto';

interface IRouteParams {
    source?: string;
    wineId?: number;
    eventId?: number;
    isBlindTasting?: boolean;
}

export const useTastingWineTasteCharacteristics = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const routeParams = (route.params as IRouteParams | undefined) || {};
    const source = routeParams.source ?? 'eventTasting';
    const wineId = routeParams.wineId;
    const eventId = routeParams.eventId;
    const { buildEventTastingDraftPayload, getEventTastingDraftData } = useEventTastingDraft();

    const [isLoading, setIsLoading] = useState(() => !wineModel.tasteCharacteristics?.length);
    const [isError, setIsError] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [sliderValues, setSliderValues] = useState<Record<number, number>>({});
    const [winePeak, setWinePeak] = useState<number | null>(wineModel.winePeak);
    const [draftTasteCharacteristics, setDraftTasteCharacteristics] = useState<AddRateDto['tasteCharacteristics']>(() => {
        return wineModel.draftTasteCharacteristics || [];
    });

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

    const getEventTastingDraft = useCallback(async () => {
        if (!eventId || !wineId) return;

        if (wineModel.draftTasteCharacteristics?.length) {
            setDraftTasteCharacteristics(wineModel.draftTasteCharacteristics);
            return;
        }

        const response = await eventTastingService.getDraft({
            eventId,
            wineId,
        });

        if (response.isError) {
            return;
        }

        const draft = getEventTastingDraftData(response.data);
        const nextTasteCharacteristics = draft.tasteCharacteristics || [];

        runInAction(() => {
            wineModel.draftTasteCharacteristics = nextTasteCharacteristics;

            if (typeof draft.winePeak === 'number') {
                wineModel.winePeak = draft.winePeak;
            }
        });

        setDraftTasteCharacteristics(nextTasteCharacteristics);

        if (typeof draft.winePeak === 'number') {
            setWinePeak(draft.winePeak);
        }
    }, [eventId, getEventTastingDraftData, wineId]);

    useEffect(() => {
        getEventTastingDraft();
    }, [getEventTastingDraft]);

    useEffect(() => {
        if (!data || data.length === 0) {
            setSliderValues(prev => Object.keys(prev).length === 0 ? prev : {});
            return;
        }

        const shouldUseDraftValues = Boolean(eventId && wineId);
        const next: Record<number, number> = {};

        data.forEach(item => {
            const maxIndex = Math.max((item.levels?.length ?? 0) - 1, 0);
            const draftValue = draftTasteCharacteristics.find(draftItem => draftItem.characteristicId === item.id);
            const draftIndex = draftValue
                ? item.levels.findIndex(level => level.id === draftValue.levelId)
                : -1;
            const baseValue =
                shouldUseDraftValues && draftIndex >= 0
                    ? draftIndex
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
    }, [data, draftTasteCharacteristics, eventId, wineId]);

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

                saveCharacteristicDetails(next);

                return next;
            });
            Keyboard.dismiss();
        },
        [data, saveCharacteristicDetails],
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

    const onPressNext = useCallback(async () => {
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

        if (eventId && wineId) {
            setIsSaving(true);

            try {
                const response = await eventTastingService.saveDraft({
                    eventId,
                    wineId,
                    data: buildEventTastingDraftPayload(wineId),
                    isFinal: false,
                });

                if (response.isError) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }
            } catch (error) {
                console.error(JSON.stringify(error, null, 2));
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
                return;
            } finally {
                setIsSaving(false);
            }

            navigation.navigate('TastingWineReviewView', {
                source,
                wineId,
                eventId,
                isBlindTasting: routeParams.isBlindTasting,
            });
            Keyboard.dismiss();
            return;
        }

        navigation.navigate('WineReviewView');
        Keyboard.dismiss();
    }, [
        buildEventTastingDraftPayload,
        data,
        eventId,
        navigation,
        routeParams.isBlindTasting,
        sliderValues,
        source,
        wineId,
        winePeak,
    ]);

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
        isSaving,
    };
};
