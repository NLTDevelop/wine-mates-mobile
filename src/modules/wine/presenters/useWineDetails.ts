import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { localization } from '@/UIProvider/localization/Localization';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { wineModel } from '@/entities/wine/WineModel';
import { wineReviewsListModel } from '@/entities/wine/WineReviewsListModel';

export const useWineDetails = () => {
    const { wineId } = (useRoute().params as { wineId: number }) || null;
    const isFocused = useIsFocused();
    const [details, setDetails] = useState<IWineDetails | null>(null);
    const [isError, setIsError] = useState(false);

    const getVintages = useCallback(async () => {
        try {
            if (!wineModel.selectedWineId) return;
            console.log('🔄 getVintages: Завантаження вінтажів для wineId:', wineModel.selectedWineId);
            const response = await wineService.getVintages(wineModel.selectedWineId);
            if (!response.isError && response.data) {
                wineModel.vintages = response.data;
                console.log('✅ getVintages: Вінтажі завантажено:', response.data.map(v => `${v.vintage} (${v.totalReviews} reviews)`));
            }
        } catch (error) {
            console.error('getVintages error: ', JSON.stringify(error, null, 2));
        }
    }, []);

    const getDetails = useCallback(async () => {
        try {
            if (!wineModel.selectedWineId) return;

            const response = await wineService.getById(wineModel.selectedWineId);

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                setIsError(true);
            } else {
                setDetails(response.data);
                setIsError(false);
            }
        } catch (error) {
            console.error('getTastes error: ', JSON.stringify(error, null, 2));
        } finally {
            
        }
    }, []);

    const onVintageChange = useCallback(async (item: IDropdownItem) => {
        console.log('🎯 onVintageChange: Вибрано вінтаж:', item);
        console.log('📋 onVintageChange: Поточний список вінтажів:', wineModel.vintages.map(v => `${v.vintage} (wineId: ${v.wineId}, reviews: ${v.totalReviews})`));
        
        if (item.id) {
            console.log('✅ onVintageChange: Вінтаж з item.id, встановлюємо selectedWineId:', item.id);
            wineModel.selectedWineId = Number(item.id);
            await getDetails();
        } else if (details) {
            const newVintageValue = item.value === null ? null : Number(item.value);
            console.log('🔍 onVintageChange: Вінтаж без item.id, шукаємо в списку:', newVintageValue);
            
            const vintageInList = wineModel.vintages.find(v => v.vintage === newVintageValue);
            
            if (vintageInList) {
                console.log('✅ onVintageChange: Вінтаж знайдено в списку, встановлюємо selectedWineId:', vintageInList.wineId);
                wineModel.selectedWineId = vintageInList.wineId;
                await getDetails();
            } else {
                console.log('❌ onVintageChange: Вінтаж НЕ знайдено в списку, встановлюємо isTasted = false');
                setDetails({
                    ...details,
                    vintage: newVintageValue,
                    isTasted: false,
                    currentVintage: null,
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
        }
        console.log('📋 onVintageChange: Список вінтажів після зміни:', wineModel.vintages.map(v => `${v.vintage} (wineId: ${v.wineId}, reviews: ${v.totalReviews})`));
    }, [details, getDetails]);

    useEffect(() => {
        if (wineId) {
            wineModel.selectedWineId = wineId;
        }
    }, [wineId]);

    useEffect(() => {
        if (wineModel.selectedWineId) {
            getDetails();
        }
    }, [wineModel.selectedWineId, getDetails]);

    useEffect(() => {
        if (isFocused && wineModel.selectedWineId) {
            getVintages();
        }
    }, [isFocused, getVintages]);

    const hasCurrentVintageData = details?.currentVintage !== null;

    return { details, vintages: wineModel.vintages, isError, getDetails, onVintageChange, hasCurrentVintageData };
};
