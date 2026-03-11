import { snackService } from '@/entities/snacks/SnackService';
import type { GenerateSnacksDto } from '@/entities/snacks/dto/GenerateSnacks.dto';
import { ISnack } from '@/entities/snacks/types/ISnack';
import { wineModel } from '@/entities/wine/WineModel';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useCallback, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { IRateContext } from '@/entities/wine/types/IRateContext';

type SetLimits = Dispatch<SetStateAction<IRateContext | null>>;

export const useFoodPairing = (setLimits?: SetLimits, generatedSnacks?: ISnack[]) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [snacks, setSnacks] = useState<ISnack[] | null>(generatedSnacks || null);

    const onGeneratePress = useCallback(async () => {
        try {
            setIsGenerating(true);

            if (!wineModel.look) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
                return;
            }

            const payload: GenerateSnacksDto = {
                wineId: wineModel.wine?.id || 0,
                color: wineModel.look,
                aromas: (wineModel.selectedSmells || []).filter(item => item.colorHex).map(item => item.id),
                flavors: (wineModel.selectedTastes || []).filter(item => item.colorHex).map(item => item.id),
                tasteCharacteristics: (wineModel.tasteCharacteristics || [])
                    .map(item => {
                        const level = item.levels[item.selectedIndex ?? 0];

                        if (!level) {
                            return null;
                        }

                        return {
                            characteristicId: item.id,
                            levelId: level.id,
                        };
                    })
                    .filter((item): item is GenerateSnacksDto['tasteCharacteristics'][number] => Boolean(item)),
            };

            const response = await snackService.generateSnacks(payload);

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            } else {
                setLimits?.(prevState => {
                    if (!prevState) {
                        return prevState;
                    }
                    return {
                        ...prevState,
                        aiUsage: {
                            ...prevState.aiUsage,
                            left: Math.max(0, prevState.aiUsage.left - 1),
                        },
                    };
                });
                const snacksData = Array.isArray(response.data.snacks)
                    ? response.data.snacks
                    : [response.data.snacks];
                setSnacks(snacksData);
            }
        } catch (error) {
            console.error('onGeneratePress error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsGenerating(false);
        }
    }, [setLimits]);

    return { snacks, isGenerating, onGeneratePress };
};
