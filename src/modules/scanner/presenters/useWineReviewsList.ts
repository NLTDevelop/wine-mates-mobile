import { useCallback, useEffect, useState } from 'react';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { wineService } from '@/entities/wine/WineService';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { wineReviewsListModel } from '@/entities/wine/WineReviewsListModel';

const LIMIT = 10;
const OFFSET = 0;

export const useWineReviewsList = (id: number | null) => {
    // const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isReviewsLoading, setIsReviewsLoading] = useState(false);
    const data = wineReviewsListModel.list?.rows || [];

    const getList = useCallback(async (offset: number) => {
        try {
            if (!id) return;
            
            setIsReviewsLoading(true);
            const params = {
                limit: LIMIT,
                offset,
                wineId: id,
            };
            const response = await wineService.getReviewsList(params);
    
            if (response.isError) {
                toastService.showError(
                    localization.t('errorHappened'),
                    response.message || localization.t('somethingWentWrong'),
                );
            }
        } catch(error) {
            console.error('getList error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsReviewsLoading(false);
        }
    }, [id]);

    const onRefresh = useCallback(
        async (offset: number = OFFSET) => {
            await getList(offset);
        },
        [getList],
    );

    const onEndReached = useCallback(async () => {
        const list = wineReviewsListModel.list;
        if (!isReviewsLoading && list && list.count > list.rows.length) {
            await getList(list.rows.length);
        }
    }, [isReviewsLoading, getList]);

    useEffect(() => {
        Promise.resolve().then(() => {
            onRefresh();
        });
    }, [onRefresh]);

    useEffect(() => {
        return () => wineReviewsListModel.clear();
    }, []);

    return { data, isReviewsLoading, onRefresh, onEndReached };
};
