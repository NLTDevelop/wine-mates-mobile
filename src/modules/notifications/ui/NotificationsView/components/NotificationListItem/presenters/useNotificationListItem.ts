import { useCallback, useMemo, useState } from 'react';
import { notificationsModel } from '@/entities/notifications/NotificationsModel';
import { notificationsService } from '@/entities/notifications/NotificationsService';
import { notificationNavigationHandler } from '@/libs/notificationService/notificationRouting/NotificationNavigationHandler';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { formatRelativeDate, isLessThanMinuteFromNow } from '@/utils';
import { IClientNotification } from '@/entities/notifications/types/IClientNotification';

interface IProps {
    item: IClientNotification;
}

export const useNotificationListItem = ({ item }: IProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const locale = localization.locale;
    const sentAt = useMemo(() => {
        if (isLessThanMinuteFromNow(item.createdAt)) {
            return localization.t('common.now');
        }

        return formatRelativeDate(item.createdAt, locale);
    }, [item.createdAt, locale]);

    const onPress = useCallback(async () => {
        const currentNotifications = notificationsModel.notifications;

        if (!item.isRead && currentNotifications) {
            const previousNotificationsCount = notificationsModel.notificationsCount;
            notificationsModel.notifications = {
                ...currentNotifications,
                rows: currentNotifications.rows.map(notification => {
                    if (notification.id === item.id) {
                        return { ...notification, isRead: true };
                    }

                    return notification;
                }),
            };
            notificationsModel.notificationsCountState = {
                ...notificationsModel.notificationsCountState,
                count: Math.max(0, previousNotificationsCount - 1),
            };

            notificationNavigationHandler.handle({ type: item.type, ...(item.data || {}) }, true);

            const response = await notificationsService.read(item.id);

            if (response.isError) {
                notificationsModel.notificationsCountState = {
                    ...notificationsModel.notificationsCountState,
                    count: previousNotificationsCount,
                };

                if (notificationsModel.notifications) {
                    notificationsModel.notifications = {
                        ...notificationsModel.notifications,
                        rows: notificationsModel.notifications.rows.map(notification => {
                            if (notification.id === item.id) {
                                return { ...notification, isRead: item.isRead };
                            }

                            return notification;
                        }),
                    };
                }

                toastService.showError(localization.t('common.errorHappened'), response.message);
            }

            return;
        }

        notificationNavigationHandler.handle({ type: item.type, ...(item.data || {}) }, true);
    }, [item]);

    const onDeletePress = useCallback(async () => {
        if (isDeleting) {
            return;
        }

        setIsDeleting(true);
        const response = await notificationsService.delete(item.id);

        if (response.isError) {
            toastService.showError(localization.t('common.errorHappened'), response.message);
        } else if (notificationsModel.notifications) {
            notificationsModel.notifications = {
                ...notificationsModel.notifications,
                count: Math.max(0, notificationsModel.notifications.count - 1),
                rows: notificationsModel.notifications.rows.filter(notification => notification.id !== item.id),
            };
        }

        setIsDeleting(false);
    }, [isDeleting, item.id]);

    return {
        sentAt,
        isDeleting,
        onPress,
        onDeletePress,
    };
};
