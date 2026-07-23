import { wineListsModel } from '@/entities/wine/models/WineListsModel';
import { myWineService } from '@/entities/wine/services/MyWineService';
import { clearWineListsFilters, clearWineListsModel } from '@/entities/wine/services/WineModelService';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { WineListScope } from '@/entities/wine/types/IWineListScope';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { usePaginationRequestGuard } from '@/hooks/usePaginationRequestGuard';

const LIMIT = 10;
const OFFSET = 0;

export const useMyWine = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isLoading, setIsLoading] = useState(false);
    const data = wineListsModel.list?.rows;
    const listRef = useRef<FlatList>(null);
    const { onTryStartPaginationRequest, onResetPaginationRequests } = usePaginationRequestGuard();

    const scrollToTop = useCallback(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    const getList = useCallback(async (offset: number) => {
        try {
            if (offset === OFFSET) {
                onResetPaginationRequests();
            }

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
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 4));
        } finally {
            setIsLoading(false);
        }
    }, [onResetPaginationRequests]);

    const onRefresh = useCallback(
        async (offset: number = OFFSET) => {
            await getList(offset);
        },
        [getList],
    );

    // useFocusEffect(
    //     useCallback(() => {
    //         onRefresh();

    //         return () => {
    //             wineListsModel.search = '';
    //             clearWineListsFilters();
    //         };
    //     }, [onRefresh])
    // );

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            onRefresh();
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [onRefresh]);

    useEffect(() => {
        return () => {
            wineListsModel.search = '';
            clearWineListsFilters();
        };
    }, []);

    useEffect(() => {
        return () => clearWineListsModel();
    }, []);

    const onEndReached = useCallback(async () => {
        const list = wineListsModel.list;
        const offset = list?.rows.length || 0;
        if (!isLoading && list && list.count > offset && onTryStartPaginationRequest(offset)) {
            await getList(offset);
        }
    }, [isLoading, getList, onTryStartPaginationRequest]);

    const onItemPress = useCallback(
        async (item: IWineListItem) => {
            if (item.myReview?.id) {
                try {
                    const params = {
                        rateId: item.myReview.id,
                        vintages: 'All' as const,
                    };
                    const response = await myWineService.getMyWineDetails(item.id, params);

                    if (response.isError || !response.data) {
                        toastService.showError(
                            localization.t('common.errorHappened'),
                            response.message || localization.t('common.somethingWentWrong'),
                        );
                        return;
                    }

                    navigation.navigate('WineDetailsView', { wineDetailsData: response.data, vintages: 'All' });
                } catch (error) {
                    console.error('onItemPress error: ', JSON.stringify(error, null, 2));
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        localization.t('common.somethingWentWrong'),
                    );
                }
            } else {
                navigation.navigate('WineDetailsView', { wineId: item.id, vintages: 'All' });
            }
        },
        [navigation],
    );

    return { data, onRefresh, onEndReached, onItemPress, isLoading, getList, scrollToTop, listRef };
};
