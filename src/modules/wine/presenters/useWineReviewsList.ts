import { useCallback, useEffect, useState } from 'react';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { wineService } from '@/entities/wine/WineService';
import { wineReviewsListModel } from '@/entities/wine/WineReviewsListModel';
import { wineModel } from '@/entities/wine/WineModel';

const LIMIT = 10;
const OFFSET = 0;

export const useWineReviewsList = (getDetails: () => Promise<void>) => {
    const [isReviewsLoading, setIsReviewsLoading] = useState(false);
    const data = wineReviewsListModel.list?.rows || [];

    const getList = useCallback(async (offset: number) => {
        try {
            if (!wineModel.selectedWineId) return;

            setIsReviewsLoading(true);
            const params = {
                limit: LIMIT,
                offset,
                wineId: wineModel.selectedWineId,
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
            await Promise.all([getDetails(), getList(offset)]);
        },
        [getList, getDetails],
    );

    const onEndReached = useCallback(async () => {
        const list = wineReviewsListModel.list;
        if (!isReviewsLoading && list && list.count > list.rows.length) {
            await getList(list.rows.length);
        }
    }, [isReviewsLoading, getList]);

    useEffect(() => {
        if (wineModel.selectedWineId) {
            getList(OFFSET);
        }
    }, [wineModel.selectedWineId, getList]);

    useEffect(() => {
        return () => wineReviewsListModel.clear();
    }, []);

    return { data, isReviewsLoading, onRefresh, onEndReached };
};
