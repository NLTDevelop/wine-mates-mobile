import { navigationRef } from '@/navigation/rootNavigator';
import { NotificationType } from '../enums/NotificationType';
import { INotificationData } from '../types/INotificationData';
import { notificationsService } from '@/entities/notifications/NotificationsService';
import { notificationsModel } from '@/entities/notifications/NotificationsModel';
import { IClientNotification } from '@/entities/notifications/types/IClientNotification';

const NOTIFICATION_TYPE_KEYS = ['notificationType', 'notification_type', 'type'];

const NOTIFICATION_TYPES = Object.values(NotificationType) as string[];
const NOTIFICATION_ID_KEYS = ['notificationId', 'notification_id', 'notifyId', 'notify_id'];

class NotificationNavigationHandler {
    private pendingData: INotificationData | null = null;
    private pendingFromNotificationsView = false;
    private pendingTimer: ReturnType<typeof setTimeout> | null = null;

    private getStringValue = (value: unknown) => {
        if (typeof value !== 'string' && typeof value !== 'number') {
            return null;
        }

        const preparedValue = String(value).trim();

        return preparedValue || null;
    };

    private getNotificationType = (data: INotificationData) => {
        const notificationTypeKey = NOTIFICATION_TYPE_KEYS.find(key => {
            const value = this.getStringValue(data[key]);
            return Boolean(value && NOTIFICATION_TYPES.includes(value));
        });

        if (notificationTypeKey) {
            const value = this.getStringValue(data[notificationTypeKey]);
            return value as NotificationType;
        }

        return null;
    };

    private getEventId = (data: INotificationData) => {
        const value = this.getStringValue(data.eventId);
        const eventId = value ? Number(value) : NaN;

        return Number.isFinite(eventId) ? eventId : null;
    };

    private getNumberValue = (data: INotificationData, keys: string[]) => {
        const key = keys.find(item => this.getStringValue(data[item]) !== null);
        const value = key ? Number(this.getStringValue(data[key])) : NaN;

        return Number.isFinite(value) ? value : null;
    };

    private getRateId = (data: INotificationData) => {
        return this.getNumberValue(data, ['rateId', 'rate_id']);
    };

    private getNotificationByRateId = (notifications: IClientNotification[], rateId: number) => {
        return notifications.find(notification => {
            return notification.type === NotificationType.WineryWineTasted
                && notification.data
                && this.getRateId(notification.data) === rateId;
        });
    };

    private updateReadNotification = (notificationId: number) => {
        const currentNotifications = notificationsModel.notifications;

        if (!currentNotifications) {
            return;
        }

        const notification = currentNotifications.rows.find(item => item.id === notificationId);

        if (!notification || notification.isRead) {
            return;
        }

        notificationsModel.notifications = {
            ...currentNotifications,
            rows: currentNotifications.rows.map(item => {
                if (item.id === notificationId) {
                    return { ...item, isRead: true };
                }

                return item;
            }),
        };
        notificationsModel.notificationsCountState = {
            ...notificationsModel.notificationsCountState,
            count: Math.max(0, notificationsModel.notificationsCount - 1),
        };
    };

    private readPushNotification = async (data: INotificationData, rateId: number) => {
        try {
            let notificationId = this.getNumberValue(data, NOTIFICATION_ID_KEYS);

            if (notificationId === null) {
                let notification = this.getNotificationByRateId(notificationsModel.notifications?.rows || [], rateId);

                if (!notification) {
                    const notificationsResponse = await notificationsService.getList({ limit: 20, offset: 0 });

                    if (!notificationsResponse.isError && notificationsResponse.data) {
                        notification = this.getNotificationByRateId(notificationsResponse.data.rows, rateId);
                    }
                }

                notificationId = notification?.id ?? null;
            }

            if (notificationId !== null) {
                const response = await notificationsService.read(notificationId);

                if (!response.isError) {
                    this.updateReadNotification(notificationId);
                }
            }
        } catch (error) {
            console.warn('NotificationNavigationHandler -> readPushNotification: ', error);
        }
    };

    private navigate = (name: string, params?: object) => {
        const navigation = navigationRef as unknown as {
            navigate: (routeName: string, routeParams?: object) => void;
        };

        navigation.navigate(name, params);
    };

    private navigateToTab = (tabName: string, screenName: string) => {
        this.navigate('TabNavigator', {
            screen: tabName,
            params: {
                screen: screenName,
            },
        });
    };

    private route = (data: INotificationData, fromNotificationsView: boolean = false) => {
        const notificationType = this.getNotificationType(data);
        const eventId = this.getEventId(data);

        if (notificationType === NotificationType.ScanWineReminder) {
            if (fromNotificationsView) {
                this.navigate('NotificationScannerStack');
                return;
            }

            this.navigateToTab('ScannerStack', 'ScannerView');
            return;
        }

        if (notificationType === NotificationType.EventRecommendation) {
            this.navigateToTab('EventStack', 'EventMapView');
            return;
        }

        if (notificationType === NotificationType.FollowersActivity) {
            this.navigateToTab('HomeStack', 'HomeView');
            return;
        }

        if (notificationType === NotificationType.EventParticipationRequest) {
            if (eventId !== null) {
                this.navigate('EventDetailsView', { eventId, initialTab: 'guests' });
                return;
            }

            this.navigate('EventListView', { initialTab: 'created' });
            return;
        }

        if (notificationType === NotificationType.EventParticipationConfirmed) {
            if (eventId !== null) {
                this.navigate('EventDetailsView', { eventId });
                return;
            }

            this.navigate('EventListView', { initialTab: 'applied' });
            return;
        }

        if (notificationType === NotificationType.EventParticipationRejected) {
            this.navigate('EventListView', { initialTab: 'applied' });
            return;
        }

        if (notificationType === NotificationType.TastingReminder && eventId !== null) {
            this.navigate('EventDetailsView', { eventId });
            return;
        }

        if (notificationType === NotificationType.WineryWineTasted) {
            const rateId = this.getRateId(data);

            if (rateId === null) {
                return;
            }

            if (!fromNotificationsView) {
                this.readPushNotification(data, rateId);
            }

            this.navigate('WineDetailsView', { notificationRateId: rateId });
        }
    };

    private flushPendingData = () => {
        this.pendingTimer = null;

        if (!navigationRef.isReady() && this.pendingData) {
            this.schedulePendingFlush();
            return;
        }

        if (!navigationRef.isReady() || !this.pendingData) {
            return;
        }

        const data = this.pendingData;
        const fromNotificationsView = this.pendingFromNotificationsView;
        this.pendingData = null;
        this.pendingFromNotificationsView = false;
        this.route(data, fromNotificationsView);
    };

    private schedulePendingFlush = () => {
        if (this.pendingTimer) {
            return;
        }

        this.pendingTimer = setTimeout(this.flushPendingData, 300);
    };

    handle = (data?: INotificationData | null, fromNotificationsView: boolean = false) => {
        if (!data) {
            return;
        }

        if (!navigationRef.isReady()) {
            this.pendingData = data;
            this.pendingFromNotificationsView = fromNotificationsView;
            this.schedulePendingFlush();
            return;
        }

        this.route(data, fromNotificationsView);
    };
}

export const notificationNavigationHandler = new NotificationNavigationHandler();
