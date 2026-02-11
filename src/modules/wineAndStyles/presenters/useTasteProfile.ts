import { useCallback, useEffect, useState } from 'react';
import { wineService } from '@/entities/wine/WineService';
import { ITasteProfile } from '@/entities/wine/types/ITasteProfile';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

export const useTasteProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tasteProfiles, setTasteProfiles] = useState<ITasteProfile[]>([]);

    const getData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await wineService.getTasteProfile();

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            } else {
                setTasteProfiles(response.data);
            }
        } catch (error) {
            console.error('getTasteProfile error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    return { isLoading, getData, tasteProfiles };
};
