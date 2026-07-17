import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { appealsService } from '@/entities/appeals/AppealsService';
import { appealsModel } from '@/entities/appeals/models/AppealsModel';
import { AppealStatus } from '@/entities/appeals/enums/AppealStatus';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerBottomModal/types/IUniversalPickerOption';
import { IAppealListItem } from '@/modules/appeals/types/IAppealListItem';

const LIMIT = 10;
const SEARCH_DELAY_MS = 350;

export const useAppealsList = (locale: string) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const list = appealsModel.list;
    const [search, setSearch] = useState('');
    const [committedSearch, setCommittedSearch] = useState('');
    const [status, setStatus] = useState<AppealStatus | null>(null);
    const [draftStatus, setDraftStatus] = useState<AppealStatus | null>(null);
    const [isStatusFilterVisible, setIsStatusFilterVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const requestIdRef = useRef(0);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setCommittedSearch(search.trim());
        }, SEARCH_DELAY_MS);

        return () => clearTimeout(timerId);
    }, [search]);

    const loadAppeals = useCallback(
        async (page: number, mode: 'initial' | 'refresh' | 'more') => {
            const requestId = requestIdRef.current + 1;
            requestIdRef.current = requestId;

            if (mode === 'initial') {
                setIsLoading(true);
            } else if (mode === 'refresh') {
                setIsRefreshing(true);
            } else {
                setIsLoadingMore(true);
            }

            try {
                const response = await appealsService.list({
                    page,
                    limit: LIMIT,
                    search: committedSearch || undefined,
                    status: status || undefined,
                });

                if (requestId !== requestIdRef.current) {
                    return;
                }

                if (response.isError || !response.data) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    return;
                }
            } finally {
                if (requestId === requestIdRef.current) {
                    setIsLoading(false);
                    setIsRefreshing(false);
                    setIsLoadingMore(false);
                }
            }
        },
        [committedSearch, status],
    );

    useFocusEffect(
        useCallback(() => {
            loadAppeals(1, 'initial');
        }, [loadAppeals]),
    );

    const onSearchChange = useCallback((value: string) => {
        setSearch(value);
    }, []);

    const onFilterPress = useCallback(() => {
        setDraftStatus(status);
        setIsStatusFilterVisible(true);
    }, [status]);

    const onCloseStatusFilter = useCallback(() => {
        setIsStatusFilterVisible(false);
    }, []);

    const onSelectAllStatuses = useCallback(() => {
        setDraftStatus(null);
    }, []);

    const onSelectOpenStatus = useCallback(() => {
        setDraftStatus(AppealStatus.OPEN);
    }, []);

    const onSelectInProgressStatus = useCallback(() => {
        setDraftStatus(AppealStatus.IN_PROGRESS);
    }, []);

    const onSelectClosedStatus = useCallback(() => {
        setDraftStatus(AppealStatus.CLOSED);
    }, []);

    const onConfirmStatusFilter = useCallback(() => {
        setIsStatusFilterVisible(false);
        setStatus(draftStatus);
    }, [draftStatus]);

    const onRefresh = useCallback(async () => {
        await loadAppeals(1, 'refresh');
    }, [loadAppeals]);

    const onLoadMore = useCallback(async () => {
        const currentList = appealsModel.list;

        if (
            !currentList ||
            isLoading ||
            isRefreshing ||
            isLoadingMore ||
            currentList.rows.length >= currentList.count
        ) {
            return;
        }

        const nextPage = Math.floor(currentList.rows.length / LIMIT) + 1;
        await loadAppeals(nextPage, 'more');
    }, [isLoading, isLoadingMore, isRefreshing, loadAppeals]);

    const onCreatePress = useCallback(() => {
        navigation.navigate('CreateAppealView');
    }, [navigation]);

    const listItems = useMemo<IAppealListItem[]>(() => {
        return (list?.rows || []).map(appeal => ({
            appeal,
            onPress: () => navigation.navigate('AppealDetailsView', { appealId: appeal.id }),
        }));
    }, [list?.rows, navigation]);

    const statusFilterOptions = useMemo<IUniversalPickerOption[]>(
        () => [
            {
                id: 'all',
                title: localization.t('appeals.allStatuses', { locale }),
                isSelected: draftStatus === null,
                onPress: onSelectAllStatuses,
            },
            {
                id: AppealStatus.OPEN,
                title: localization.t('appeals.status.OPEN', { locale }),
                isSelected: draftStatus === AppealStatus.OPEN,
                onPress: onSelectOpenStatus,
            },
            {
                id: AppealStatus.IN_PROGRESS,
                title: localization.t('appeals.status.IN_PROGRESS', { locale }),
                isSelected: draftStatus === AppealStatus.IN_PROGRESS,
                onPress: onSelectInProgressStatus,
            },
            {
                id: AppealStatus.CLOSED,
                title: localization.t('appeals.status.CLOSED', { locale }),
                isSelected: draftStatus === AppealStatus.CLOSED,
                onPress: onSelectClosedStatus,
            },
        ],
        [draftStatus, locale, onSelectAllStatuses, onSelectClosedStatus, onSelectInProgressStatus, onSelectOpenStatus],
    );

    return {
        listItems,
        search,
        status,
        statusFilterOptions,
        isStatusFilterVisible,
        isLoading,
        isRefreshing,
        isLoadingMore,
        onSearchChange,
        onFilterPress,
        onCloseStatusFilter,
        onConfirmStatusFilter,
        onRefresh,
        onLoadMore,
        onCreatePress,
    };
};
