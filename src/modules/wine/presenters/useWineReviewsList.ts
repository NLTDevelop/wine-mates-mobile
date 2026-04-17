import { useCallback, useEffect, useState } from 'react';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { wineService } from '@/entities/wine/WineService';
import { wineReviewsListModel } from '@/entities/wine/WineReviewsListModel';
import { useIsFocused } from '@react-navigation/native';
import { IWineReviewsListItem } from '@/entities/wine/types/IWineReviewsListItem';

const LIMIT = 10;
const OFFSET = 0;

export const useWineReviewsList = (
    getDetails: (params?: { vintages?: 'All' }) => Promise<void>,
    wineId?: number | null,
    isAllVintagesSelected: boolean = false,
    isPreloadedData: boolean = false,
    myReview?: IWineReviewsListItem | null,
) => {
    const [isReviewsLoading, setIsReviewsLoading] = useState(false);
    const isFocused = useIsFocused();
    const data = isPreloadedData && myReview ? [myReview] : (wineReviewsListModel.list?.rows || []);

    const getList = useCallback(async (offset: number, targetWineId: number) => {
        try {
            setIsReviewsLoading(true);
            const params = {
                limit: LIMIT,
                offset,
                wineId: targetWineId,
                ...(isAllVintagesSelected ? { vintages: 'All' as const } : {}),
            };
            const response = await wineService.getReviewsList(params);

            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            }
        } catch(error) {
            console.error('getList error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsReviewsLoading(false);
        }
    }, [isAllVintagesSelected]);

    const onRefresh = useCallback(
        async (offset: number = OFFSET) => {
            if (!wineId) return;
            
            if (isPreloadedData) {
                await getDetails(isAllVintagesSelected ? { vintages: 'All' } : undefined);
                return;
            }
            
            await Promise.all([getDetails(isAllVintagesSelected ? { vintages: 'All' } : undefined), getList(offset, wineId)]);
        },
        [getList, getDetails, wineId, isAllVintagesSelected, isPreloadedData],
    );

    const onEndReached = useCallback(async () => {
        if (isPreloadedData) {
            return;
        }
        
        const list = wineReviewsListModel.list;
        if (!isReviewsLoading && list && list.count > list.rows.length && wineId) {
            await getList(list.rows.length, wineId);
        }
    }, [isReviewsLoading, getList, wineId, isPreloadedData]);

    useEffect(() => {
        if (isPreloadedData) {
            return;
        }
        
        if (isFocused && wineId) {
            wineReviewsListModel.clear();
            getList(OFFSET, wineId);
        }
    }, [isFocused, getList, wineId, isAllVintagesSelected, isPreloadedData]);

    useEffect(() => {
        return () => wineReviewsListModel.clear();
    }, []);

    return { data, isReviewsLoading, onRefresh, onEndReached };
};
