import { eventTastingService } from '@/entities/events/EventTastingService';
import { AddRateDto } from '@/entities/wine/dto/AddRate.dto';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';

interface IUseSaveEventTastingDraftOnBlurParams {
    eventId?: number;
    wineId?: number;
    buildPayload: (wineId: number) => Partial<AddRateDto>;
    isFinal?: boolean;
    isEnabled?: boolean;
    onBeforeSave?: () => void;
}

export const useSaveEventTastingDraftOnBlur = ({
    eventId,
    wineId,
    buildPayload,
    isFinal = false,
    isEnabled = true,
    onBeforeSave,
}: IUseSaveEventTastingDraftOnBlurParams) => {
    const shouldSkipNextBlurSaveRef = useRef(false);
    const saveDraftRef = useRef<() => Promise<void>>(async () => undefined);

    const skipNextBlurSave = useCallback(() => {
        shouldSkipNextBlurSaveRef.current = true;
    }, []);

    const saveDraft = useCallback(async () => {
        if (!isEnabled || !eventId || !wineId) {
            return;
        }

        onBeforeSave?.();

        try {
            const response = await eventTastingService.saveDraft({
                eventId,
                wineId,
                data: buildPayload(wineId),
                isFinal,
            });

            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        }
    }, [buildPayload, eventId, isEnabled, isFinal, onBeforeSave, wineId]);

    useEffect(() => {
        saveDraftRef.current = saveDraft;
    }, [saveDraft]);

    useFocusEffect(
        useCallback(() => {
            return () => {
            if (shouldSkipNextBlurSaveRef.current) {
                shouldSkipNextBlurSaveRef.current = false;
                return;
            }

                saveDraftRef.current();
            };
        }, []),
    );

    return {
        saveDraft,
        skipNextBlurSave,
    };
};
