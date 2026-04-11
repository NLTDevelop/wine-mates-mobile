import { wineListsModel } from '@/entities/wine/WineListsModel';
import { myWineService } from '@/entities/wine/MyWineService';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { WineListScope } from '@/entities/wine/types/IWineListScope';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';

const LIMIT = 10;
const OFFSET = 0;

export const useMyWine = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isLoading, setIsLoading] = useState(false);
    const [scrollToTop, setScrollToTop] = useState<(() => void) | null>(null);
    const data = wineListsModel.list?.rows;
    const listRef = useRef<FlatList>(null);

    const handleScrollToTop = useCallback(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    useEffect(() => {
        setScrollToTop(() => handleScrollToTop);
    }, [handleScrollToTop, setScrollToTop]);

    const getList = useCallback(async (offset: number) => {
        try {
            setIsLoading(true);
            
            const filters = wineListsModel.filters;
            const params = {
                limit: LIMIT,
                offset,
                search: wineListsModel.search,
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

    useFocusEffect(
        useCallback(() => {
            onRefresh();

            return () => {
                wineListsModel.search = '';
                wineListsModel.clearFilters();
            };
        }, [onRefresh])
    );

    useEffect(() => {
        return () => wineListsModel.clear();
    }, []);

    const onEndReached = useCallback(async () => {
        const list = wineListsModel.list;
        if (!isLoading && list && list.count > list.rows.length) {
            await getList(list.rows.length);
        }
    }, [isLoading, getList]);

    const onItemPress = useCallback(async (item: IWineListItem) => {
        if (item.myReview?.id) {
            try {
                const response = await myWineService.getMyWineDetails(item.id, item.myReview.id);
                
                if (response.isError || !response.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }
                
                navigation.navigate('WineDetailsView', { wineDetailsData: response.data });
            } catch (error) {
                console.error('onItemPress error: ', JSON.stringify(error, null, 2));
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            }
        } else {
            navigation.navigate('WineDetailsView', { wineId: item.id });
        }
    }, [navigation]);

    return { data, onRefresh, onEndReached, onItemPress, isLoading, getList, scrollToTop, listRef };
};
