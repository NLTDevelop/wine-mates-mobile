import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { localization } from '@/UIProvider/localization/Localization';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { wineModel } from '@/entities/wine/WineModel';
import { wineReviewsListModel } from '@/entities/wine/WineReviewsListModel';
import { NONE_VINTAGE_DROPDOWN_VALUE } from './useVintageDropdown';

export const useWineDetails = () => {
    const route = useRoute();
    const { wineId, fromScanner } = (route.params as { wineId: number; fromScanner?: boolean }) || { wineId: null, fromScanner: false };
    const isFocused = useIsFocused();
    const [details, setDetails] = useState<IWineDetails | null>(null);
    const [isError, setIsError] = useState(false);
    const [isAllVintagesSelected, setIsAllVintagesSelected] = useState(false);

    const getDetails = useCallback(async (params?: { vintages?: 'All' }) => {
        try {
            if (!wineModel.selectedWineId) return;

            const response = await wineService.getById(wineModel.selectedWineId, params);

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                setIsError(true);
            } else {
                setDetails(response.data);
                wineModel.vintages = response.data.vintages;
                setIsError(false);
            }
        } catch (error) {
            console.error('getTastes error: ', JSON.stringify(error, null, 2));
        } finally {
            
        }
    }, []);

    const onVintageChange = useCallback(async (item: IDropdownItem) => {
        const isNoneVintage = item.value === NONE_VINTAGE_DROPDOWN_VALUE;
        const isAllVintages = item.value === null
            || (typeof item.label === 'string' && item.label.toLowerCase() === localization.t('wine.allVintages').toLowerCase())
            || (typeof item.value === 'string' && item.value.toLowerCase() === 'all');

        if (isAllVintages) {
            setIsAllVintagesSelected(true);
            await getDetails({ vintages: 'All' });
            return;
        }

        setIsAllVintagesSelected(false);
        const selectedWineId = item.id ? Number(item.id) : null;
        const selectedVintage = isNoneVintage || item.value === null ? null : Number(item.value);

        if (selectedWineId && selectedWineId !== wineModel.selectedWineId) {
            wineModel.selectedWineId = selectedWineId;
            await getDetails();
            return;
        }

        if (selectedWineId && selectedWineId === wineModel.selectedWineId) {
            await getDetails();
            return;
        }

        if (selectedVintage !== null && Number.isNaN(selectedVintage)) {
            return;
        }

        if (details) {
            setDetails({
                ...details,
                vintage: selectedVintage,
                isTasted: false,
                currentVintage: null,
                averageUserRating: 0,
                averageExpertRating: 0,
                countUserRating: 0,
                countExpertRating: 0,
                totalReviews: 0,
                aiTastingNote: undefined,
                aiSnacks: [],
                statistics: {
                    topColors: [],
                    topAromas: [],
                    topFlavors: [],
                    tasteCharacteristics: [],
                    topWinePeaks: [],
                },
            });
            wineReviewsListModel.clear();
        }
    }, [details, getDetails]);

    useEffect(() => {
        if (!isFocused || !wineId) return;

        setIsAllVintagesSelected(false);
        wineModel.selectedWineId = wineId;
        getDetails();
    }, [wineId, isFocused, getDetails]);

    const hasCurrentVintageData = !!details?.currentVintage && typeof details.currentVintage === 'object';

    return {
        details,
        vintages: wineModel.vintages ?? [],
        isError,
        getDetails,
        onVintageChange,
        hasCurrentVintageData,
        isAllVintagesSelected,
        wineId,
        selectedWineId: wineModel.selectedWineId,
        fromScanner,
    };
};
