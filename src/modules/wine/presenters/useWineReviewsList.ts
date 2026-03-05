import { useCallback, useEffect, useState } from 'react';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { wineService } from '@/entities/wine/WineService';
import { wineReviewsListModel } from '@/entities/wine/WineReviewsListModel';
import { useIsFocused } from '@react-navigation/native';

const LIMIT = 10;
const OFFSET = 0;

export const useWineReviewsList = (getDetails: () => Promise<void>, wineId?: number | null) => {
    const [isReviewsLoading, setIsReviewsLoading] = useState(false);
    const isFocused = useIsFocused();
    const data = wineReviewsListModel.list?.rows || [];

    const getList = useCallback(async (offset: number, targetWineId: number) => {
        try {
            setIsReviewsLoading(true);
            const params = {
                limit: LIMIT,
                offset,
                wineId: targetWineId,
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
    }, []);

    const onRefresh = useCallback(
        async (offset: number = OFFSET) => {
            if (!wineId) return;
            await Promise.all([getDetails(), getList(offset, wineId)]);
        },
        [getList, getDetails, wineId],
    );

    const onEndReached = useCallback(async () => {
        const list = wineReviewsListModel.list;
        if (!isReviewsLoading && list && list.count > list.rows.length && wineId) {
            await getList(list.rows.length, wineId);
        }
    }, [isReviewsLoading, getList, wineId]);

    useEffect(() => {
        if (isFocused && wineId) {
            getList(OFFSET, wineId);
        }
    }, [isFocused, getList, wineId]);

    useEffect(() => {
        return () => wineReviewsListModel.clear();
    }, []);

    return { data, isReviewsLoading, onRefresh, onEndReached };
};
