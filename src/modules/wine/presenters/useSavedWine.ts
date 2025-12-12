import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useCallback, useEffect, useState } from 'react';

export const useSavedWines = () => {
    const [wines, setWines] = useState<IWineListItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const getSavedWines = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await wineService.getSavedWines();

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                setIsError(true);
            } else {
                setWines(response.data);
                setIsError(false);
            }
        } catch (error) {
            console.error('getSavedWines error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // getSavedWines();
    }, [getSavedWines]);

    return { isLoading, wines, isError, getSavedWines };
};
