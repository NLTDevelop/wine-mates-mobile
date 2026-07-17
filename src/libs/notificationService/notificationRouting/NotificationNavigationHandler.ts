import { navigationRef } from '@/navigation/rootNavigator';
import { NotificationType } from '../enums/NotificationType';
import { INotificationData } from '../types/INotificationData';

const NOTIFICATION_TYPE_KEYS = ['notificationType', 'notification_type', 'type'];

const NOTIFICATION_TYPES = Object.values(NotificationType) as string[];

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
