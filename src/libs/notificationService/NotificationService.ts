import { FirebaseMessaging, IMessaging } from './firebase';
import { notificationHandler } from './pushNotification/NotificationHandler';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

class NotificationService {
    private static instance: NotificationService;

    private _notificationHandler = notificationHandler;
    private _messaging?: IMessaging;
    private _unsubscribeForeground?: () => void;

    constructor() {
        if (NotificationService.instance) {
            return NotificationService.instance;
        }

        NotificationService.instance = this;
    }

    private get messaging() {
        if (!this._messaging) {
            this._messaging = new FirebaseMessaging();
        }

        return this._messaging;
    }

    requestPermissions = async () => {
        return this._notificationHandler.requestPermission();
    };

    createChannels = async () => {
        const defaultChannelId = await this._notificationHandler.createChannel();

        return { defaultChannelId };
    };

    removeAllDeliveredNotifications = () => {
        this._notificationHandler.removeAllDeliveredNotifications();
    };

    syncBadgeCount = (count: number) => {
        const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
        this._notificationHandler.setBadgeCount(safeCount);
    };

    getToken = async () => {
        return this.messaging.getFCMToken();
    };

    register = async () => {
        await this.messaging.registerAppWithFCM();

        return this.getToken();
    };

    deleteToken = async () => {
        await this.messaging.removeFCMToken();
    };

    subscribeForeground = () => {
        const unsubscribeMessaging = this.messaging.subscribeAppOnForegroundMessages(this.onReceiveNotification);

        return () => {
            unsubscribeMessaging();
        };
    };

    startForegroundSubscription = () => {
        if (this._unsubscribeForeground) {
            return;
        }

        this._unsubscribeForeground = this.subscribeForeground();
    };

    stopForegroundSubscription = () => {
        if (!this._unsubscribeForeground) {
            return;
        }

        this._unsubscribeForeground();
        this._unsubscribeForeground = undefined;
    };

    subscribeBackground = () => {
        this.messaging.subscribeAppOnBackgroundMessages(this.onBackgroundNotification);
    };

    private onBackgroundNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        if (!remoteMessage.notification) {
            await this._notificationHandler.createLocalNotification(remoteMessage);
        }
    };

    onReceiveNotification = async (
        remoteMessage: FirebaseMessagingTypes.RemoteMessage,
        type: string,
    ) => {
        if (type === 'onMessage') {
            await this._notificationHandler.createLocalNotification(remoteMessage);
        }
    };
}

export const notificationService = new NotificationService();
