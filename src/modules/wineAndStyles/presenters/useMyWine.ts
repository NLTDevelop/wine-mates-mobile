import { myWineListModel } from '@/entities/wine/MyWineListModel';
import { myWineService } from '@/entities/wine/MyWineService';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { WineListScope } from '@/entities/wine/types/IWineListScope';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';

const LIMIT = 10;
const OFFSET = 0;

export const useMyWine = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isLoading, setIsLoading] = useState(false);
    const data = myWineListModel.list?.rows;

    const getList = useCallback(async (offset: number) => {
        try {
            setIsLoading(true);
            
            const filters = myWineListModel.filters;
            const params = {
                limit: LIMIT,
                offset,
                search: myWineListModel.search,
                scope: WineListScope.MY,
                sort: filters.sort.length > 0 ? filters.sort[0] : undefined,
                typeId: filters.types.length > 0 ? filters.types[0] : undefined,
                colorId: filters.colors.length > 0 ? filters.colors[0] : undefined,
            };

            const response = await myWineService.list(params);
    
            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            } else {
                //TODO
            }
        } catch(error) {
            console.error(JSON.stringify(error, null, 4));
        } finally {
            setIsLoading(false);
        }
    }, []);

    const onRefresh = useCallback(async (offset: number = OFFSET) => {
        await getList(offset);
    }, [getList]);

    useEffect(() => {
        if (!myWineListModel.list) {
            onRefresh();
        }
    }, [onRefresh]);

    const onEndReached = useCallback(async () => {
        const list = myWineListModel.list;
        if (!isLoading && list && list.count > list.rows.length) {
            await getList(list.rows.length);
        }
    }, [isLoading, getList]);

    const onItemPress = useCallback((item: IWineListItem) => {
        navigation.navigate('WineDetailsView', {wineId: item.id});
    },[navigation]);

    return { data, onRefresh, onEndReached, onItemPress, isLoading, getList };
};
