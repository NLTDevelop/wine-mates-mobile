import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { wineryWineService } from '@/entities/winery/services/WineryWineService';
import { availableWineryWinesModel } from '@/entities/winery/models/AvailableWineryWinesModel';
import { userModel } from '@/entities/users/UserModel';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

const LIMIT = 10;

export const useAddWineryWines = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const wineryId = userModel.winery?.id;
    const list = availableWineryWinesModel.list;
    const wines = list?.rows || [];
    const [selectedWine, setSelectedWine] = useState<IWineListItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isError, setIsError] = useState(false);

    const loadWines = useCallback(
        async (offset: number) => {
            if (!wineryId) {
                setIsError(true);
                setIsLoading(false);
                return;
            }

            const isFirstPage = offset === 0;

            try {
                setIsError(false);

                if (isFirstPage) {
                    setIsLoading(true);
                } else {
                    setIsLoadingMore(true);
                }

                const response = await wineryWineService.getAvailableWines({
                    wineryId,
                    limit: LIMIT,
                    offset,
                });

                if (response.isError || !response.data) {
                    setIsError(true);
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }

                if (isFirstPage) {
                    availableWineryWinesModel.list = response.data;
                } else {
                    availableWineryWinesModel.append(response.data);
                }
            } catch (error) {
                console.error('useAddWineryWines -> loadWines: ', error);
                setIsError(true);
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        [wineryId],
    );

    const onRefresh = useCallback(async () => {
        await loadWines(0);
    }, [loadWines]);

    useEffect(() => {
        const frameId = requestAnimationFrame(onRefresh);

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [onRefresh]);

    useEffect(() => {
        return () => {
            availableWineryWinesModel.list = null;
        };
    }, []);

    const onLoadMore = useCallback(async () => {
        const currentList = availableWineryWinesModel.list;

        if (isLoading || isLoadingMore || !currentList || currentList.rows.length >= currentList.count) {
            return;
        }

        await loadWines(currentList.rows.length);
    }, [isLoading, isLoadingMore, loadWines]);

    const onWinePress = useCallback((wine: IWineListItem) => {
        setSelectedWine(wine);
    }, []);

    const onCloseAlert = useCallback(() => {
        if (!isAdding) {
            setSelectedWine(null);
        }
    }, [isAdding]);

    const onConfirmAdd = useCallback(async () => {
        if (!wineryId || !selectedWine || isAdding) {
            return;
        }

        const wineId = selectedWine.id;

        try {
            setIsAdding(true);
            const response = await wineryWineService.linkWines({
                wineryId,
                wineIds: [wineId],
            });

            if (response.isError || response.data?.success === false) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            const currentList = availableWineryWinesModel.list;

            if (currentList) {
                availableWineryWinesModel.list = {
                    ...currentList,
                    count: Math.max(0, currentList.count - 1),
                    rows: currentList.rows.filter(wine => wine.id !== wineId),
                };
            }
            setSelectedWine(null);
            toastService.showSuccess(localization.t('profile.wineAddedToWinery'));
        } catch (error) {
            console.error('useAddWineryWines -> onConfirmAdd: ', error);
            toastService.showError(localization.t('common.errorHappened'), localization.t('common.somethingWentWrong'));
        } finally {
            setIsAdding(false);
        }
    }, [isAdding, selectedWine, wineryId]);

    const onPressBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return {
        wines,
        selectedWine,
        isLoading,
        isLoadingMore,
        isAdding,
        isError,
        onRefresh,
        onLoadMore,
        onWinePress,
        onCloseAlert,
        onConfirmAdd,
        onPressBack,
    };
};
