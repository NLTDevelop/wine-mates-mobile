import { useCallback, useEffect, useState } from 'react';
import { wineService } from '@/entities/wine/WineService';
import { wineAndStylesModel } from '@/entities/wine/WineAndStylesModel';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

export const useTasteProfile = () => {
    const [isLoading, setIsLoading] = useState(false);

    const tasteProfiles = wineAndStylesModel.tasteProfiles;

    const fetchRecommendations = useCallback(async () => {
        const profiles = wineAndStylesModel.tasteProfiles;

        await Promise.all(
            profiles.map(async (profile) => {
                const key = wineAndStylesModel.getRecommendationKey(profile.type.id, profile.color.id);
                const response = await wineService.getRecommendations({
                    typeId: profile.type.id,
                    colorId: profile.color.id,
                });

                if (!response.isError && response.data) {
                    wineAndStylesModel.setRecommendations(key, response.data.rows, 1, response.data.totalPages);
                }
            })
        );
    }, []);

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
                wineAndStylesModel.setTasteProfiles(response.data);
                await fetchRecommendations();
            }
        } catch (error) {
            console.error('getTasteProfile error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, [fetchRecommendations]);

    useEffect(() => {
        getData();
    }, [getData]);

    return { isLoading, getData, tasteProfiles };
};
