import { useCallback, useEffect, useMemo, useState } from 'react';
import { notificationsModel } from '@/entities/notifications/NotificationsModel';
import { notificationsService } from '@/entities/notifications/NotificationsService';
import { localization } from '@/UIProvider/localization/Localization';
import { toastService } from '@/libs/toast/toastService';
import { usePaginationRequestGuard } from '@/hooks/usePaginationRequestGuard';

const LIMIT = 20;

export const useNotificationsView = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
    const { onTryStartPaginationRequest, onResetPaginationRequests } = usePaginationRequestGuard();
    const notifications = notificationsModel.notifications;
    const notificationItems = useMemo(() => notifications?.rows || [], [notifications]);
    const hasMore = Boolean(notifications && notifications.count > notificationItems.length);
    const hasUnreadNotifications = useMemo(
        () => notificationItems.some(notification => !notification.isRead),
        [notificationItems],
    );

    const loadNotifications = useCallback(async (offset: number) => {
        const response = await notificationsService.getList({ limit: LIMIT, offset });

        if (response.isError) {
            toastService.showError(localization.t('common.errorHappened'), response.message);
        }
    }, []);

    const onRefresh = useCallback(async () => {
        onResetPaginationRequests();
        await loadNotifications(0);
    }, [loadNotifications, onResetPaginationRequests]);

    useEffect(() => {
        let isActive = true;

        const onLoadInitialNotifications = async () => {
            onResetPaginationRequests();
            setIsLoading(true);
            await loadNotifications(0);

            if (isActive) {
                setIsLoading(false);
            }
        };

        onLoadInitialNotifications();

        return () => {
            isActive = false;
        };
    }, [loadNotifications, onResetPaginationRequests]);

    const onLoadMore = useCallback(async () => {
        if (!hasMore || isLoading || isLoadingMore) {
            return;
        }

        const offset = notificationItems.length;
        if (!onTryStartPaginationRequest(offset)) {
            return;
        }

        setIsLoadingMore(true);
        try {
            await loadNotifications(offset);
        } finally {
            setIsLoadingMore(false);
        }
    }, [hasMore, isLoading, isLoadingMore, loadNotifications, notificationItems.length, onTryStartPaginationRequest]);

    const onMarkAllRead = useCallback(async () => {
        if (!hasUnreadNotifications || isMarkingAllRead) {
            return;
        }

        const currentNotifications = notificationsModel.notifications;
        const previousNotificationsCount = notificationsModel.notificationsCount;
        const previousReadStatusById = new Map(
            (currentNotifications?.rows || []).map(notification => [notification.id, notification.isRead]),
        );

        setIsMarkingAllRead(true);
        if (currentNotifications) {
            notificationsModel.notifications = {
                ...currentNotifications,
                rows: currentNotifications.rows.map(notification => ({
                    ...notification,
                    isRead: true,
                })),
            };
        }
        notificationsModel.notificationsCountState = {
            ...notificationsModel.notificationsCountState,
            count: 0,
        };

        try {
            const response = await notificationsService.markAllRead();

            if (response.isError) {
                notificationsModel.notificationsCountState = {
                    ...notificationsModel.notificationsCountState,
                    count: previousNotificationsCount,
                };

                if (notificationsModel.notifications) {
                    notificationsModel.notifications = {
                        ...notificationsModel.notifications,
                        rows: notificationsModel.notifications.rows.map(notification => ({
                            ...notification,
                            isRead: previousReadStatusById.get(notification.id) ?? notification.isRead,
                        })),
                    };
                }

                toastService.showError(localization.t('common.errorHappened'), response.message);
                return;
            }
        } finally {
            setIsMarkingAllRead(false);
        }
    }, [hasUnreadNotifications, isMarkingAllRead]);

    return {
        notificationItems,
        isLoading,
        isLoadingMore,
        isMarkingAllRead,
        hasUnreadNotifications,
        onRefresh,
        onLoadMore,
        onMarkAllRead,
    };
};
