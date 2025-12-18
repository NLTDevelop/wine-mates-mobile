import { useCallback, useEffect, useState } from 'react';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { wineService } from '@/entities/wine/WineService';
import { wineListModel } from '@/entities/wine/WineListModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { wineModel } from '@/entities/wine/WineModel';

const LIMIT = 10;
const OFFSET = 0;

export const useScannerResultsList = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isLoading, setIsLoading] = useState(false);
    const data = wineListModel.list?.rows;

    const getList = useCallback(async (offset: number) => {
        setIsLoading(true);

        const params = {
            limit: LIMIT,
            offset
        }

        const formData = new FormData();
        
        if (wineModel.image) {
            formData.append('image', wineModel.image as any);
        }

        const response = await wineService.list(params, formData);

        if (response.isError) {
            toastService.showError(
                localization.t('errorHappened'),
                response.message || localization.t('somethingWentWrong'),
            );
        }

        setIsLoading(false);
    }, []);

    const onRefresh = useCallback(
        async (offset: number = OFFSET) => {
            await getList(offset);
        },
        [getList],
    );

    const onEndReached = useCallback(async () => {
        const list = wineListModel.list;
        if (!isLoading && list && list.count > list.rows.length) {
            await getList(list.rows.length);
        }
    }, [isLoading, getList]);

    useEffect(() => {
        Promise.resolve().then(() => {
            onRefresh();
        });
    }, [onRefresh]);

    useEffect(() => {
        return () => wineListModel.clear();
    }, []);

    const handleItemPress = useCallback((item: IWineListItem) => {
        navigation.navigate('WineDetailsView', {wineId: item.id});
    },[navigation]);

    const handleAddWinePress = useCallback(() => {
        navigation.navigate('AddWineView');
    },[navigation]);

    return { data, isLoading, onRefresh, onEndReached, handleItemPress, handleAddWinePress };
};
