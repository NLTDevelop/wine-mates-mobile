import notifee, {
    AndroidImportance,
    AndroidStyle,
    EventType,
    NotificationAndroid,
    Notification,
} from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { isIOS } from '../../../utils';
import { INotificationData } from '../types/INotificationData';

const DEFAULT_CHANNEL_ID = 'default';
const DEFAULT_SOUND = 'default';

class NotificationHandler {
    private normalizeString = (value: unknown): string | undefined => {
        if (typeof value !== 'string' && typeof value !== 'number') {
            return undefined;
        }

        const normalized = String(value).trim();

        return normalized.length ? normalized : undefined;
    };

    private getNotificationTitle = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        return this.normalizeString(remoteMessage.notification?.title ?? remoteMessage.data?.title) ?? '';
    };

    private getNotificationBody = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        return this.normalizeString(remoteMessage.notification?.body ?? remoteMessage.data?.body) ?? '';
    };

    private getNotificationImageUrl = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        const fcmOptions = remoteMessage.data?.fcm_options as { image?: unknown } | undefined;

        return this.normalizeString(
            remoteMessage.data?.imageUrl
            ?? remoteMessage.data?.image_url
            ?? remoteMessage.notification?.android?.imageUrl
            ?? fcmOptions?.image,
        );
    };

    private getAndroidNotificationStyle = (body: string, imageUrl?: string): NotificationAndroid['style'] => {
        if (body) {
            return {
                type: AndroidStyle.BIGTEXT,
                text: body,
            };
        }

        if (imageUrl) {
            return {
                type: AndroidStyle.BIGPICTURE,
                picture: imageUrl,
            };
        }

        return undefined;
    };

    private getNotificationId = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        return this.normalizeString(remoteMessage.data?.notify_id ?? remoteMessage.messageId) ?? String(Date.now());
    };

    createChannel = async () => {
        if (isIOS) {
            return null;
        }

        return notifee.createChannel({
            id: DEFAULT_CHANNEL_ID,
            name: 'Default Channel',
            sound: DEFAULT_SOUND,
            importance: AndroidImportance.HIGH,
        });
    };

    requestPermission = async () => {
        const { authorizationStatus } = await notifee.requestPermission();

        return authorizationStatus;
    };

    createLocalNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<void> => {
        const imageUrl = this.getNotificationImageUrl(remoteMessage);
        const title = this.getNotificationTitle(remoteMessage);
        const body = this.getNotificationBody(remoteMessage);
        const androidStyle = this.getAndroidNotificationStyle(body, imageUrl);

        if (!title && !body) {
            return;
        }

        const notification: Notification = {
            id: this.getNotificationId(remoteMessage),
            title,
            body,
            data: remoteMessage.data,
            android: {
                channelId: DEFAULT_CHANNEL_ID,
                pressAction: { id: DEFAULT_CHANNEL_ID },
                importance: AndroidImportance.HIGH,
                sound: DEFAULT_SOUND,
                ...(imageUrl ? { largeIcon: imageUrl } : {}),
                ...(androidStyle ? { style: androidStyle } : {}),
            },
            ios: {
                sound: DEFAULT_SOUND,
                ...(imageUrl ? { attachments: [{ url: imageUrl }] } : {}),
            },
        };

        await notifee.displayNotification(notification);
    };

    setBadgeCount = async (count: number): Promise<void> => {
        const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;

        await notifee.setBadgeCount(safeCount);
    };

    removeAllDeliveredNotifications = async (): Promise<void> => {
        await notifee.setBadgeCount(0);
        await notifee.cancelAllNotifications();
    };

    getInitialPressData = async (): Promise<INotificationData | null> => {
        const initialNotification = await notifee.getInitialNotification();

        return initialNotification?.notification.data ?? null;
    };

    subscribePressEvents = (onPress: (data: INotificationData) => void) => {
        return notifee.onForegroundEvent(({ type, detail }) => {
            if (type !== EventType.PRESS) {
                return;
            }

            if (!detail.notification?.data) {
                return;
            }

            onPress(detail.notification.data);
        });
    };
}

export const notificationHandler = new NotificationHandler();
