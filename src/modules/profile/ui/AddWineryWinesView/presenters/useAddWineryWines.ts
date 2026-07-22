import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { wineryWineService } from '@/entities/winery/services/WineryWineService';
import { availableWineryWinesModel } from '@/entities/winery/models/AvailableWineryWinesModel';
import { wineryLinkedWinesModel } from '@/entities/winery/models/WineryLinkedWinesModel';
import { userModel } from '@/entities/users/UserModel';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { usePaginationRequestGuard } from '@/hooks/usePaginationRequestGuard';

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
    const { onTryStartPaginationRequest, onResetPaginationRequests } = usePaginationRequestGuard();

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
        onResetPaginationRequests();
        await loadWines(0);
    }, [loadWines, onResetPaginationRequests]);

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

        const offset = currentList?.rows.length || 0;
        if (
            isLoading ||
            isLoadingMore ||
            !currentList ||
            offset >= currentList.count ||
            !onTryStartPaginationRequest(offset)
        ) {
            return;
        }

        await loadWines(offset);
    }, [isLoading, isLoadingMore, loadWines, onTryStartPaginationRequest]);

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

            const linkedWines = wineryLinkedWinesModel.list;
            const isWineAlreadyLinked = linkedWines?.rows.some(wine => wine.id === wineId);

            if (!isWineAlreadyLinked) {
                wineryLinkedWinesModel.list = linkedWines
                    ? {
                          ...linkedWines,
                          count: linkedWines.count + 1,
                          rows: [selectedWine, ...linkedWines.rows],
                      }
                    : {
                          count: 1,
                          totalPages: 1,
                          rows: [selectedWine],
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
