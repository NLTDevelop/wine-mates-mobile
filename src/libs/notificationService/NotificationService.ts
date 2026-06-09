import { FirebaseMessaging, IMessaging } from './firebase';
import { notificationHandler } from './pushNotification/NotificationHandler';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { IRequester, requester } from '../requester';
import { ILinks, links } from '@/Links';

class NotificationService {
    private static instance: NotificationService;

    private _notificationHandler = notificationHandler;
    private _messaging?: IMessaging;
    private _unsubscribeForeground?: () => void;
    private _unsubscribeTokenRefresh?: () => void;
    private _registeredToken?: string;

    constructor(
        private _requester: IRequester = requester,
        private _links: ILinks = links,
    ) {
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

    private registerToken = async (token: string) => {
        if (!token) {
            return null;
        }

        if (token === this._registeredToken) {
            return null;
        }

        if (__DEV__) {
            console.info('NotificationService -> FCM token: ', token);
        }

        try {
            const response = await this._requester.request({
                method: 'POST',
                url: this._links.device,
                data: {
                    fcmToken: token,
                    deviceType: Platform.OS,
                },
            });

            if (!response.isError) {
                this._registeredToken = token;
            }

            return response;
        } catch (error) {
            console.warn('NotificationService -> registerToken: ', error);
            return null;
        }
    };

    private unregisterToken = async (token: string) => {
        if (!token) {
            return null;
        }

        try {
            return this._requester.request({
                method: 'POST',
                url: this._links.deviceUnregister,
                data: {
                    fcmToken: token,
                },
            });
        } catch (error) {
            console.warn('NotificationService -> unregisterToken: ', error);
            return null;
        }
    };

    register = async () => {
        await this.messaging.registerAppWithFCM();

        const token = await this.getToken();

        if (__DEV__) {
            const APNSToken = await this.messaging.getAPNSToken();
            console.info('NotificationService -> APNs token: ', APNSToken);
        }

        return this.registerToken(token);
    };

    deleteToken = async () => {
        await this.messaging.removeFCMToken();
    };

    unregisterCurrentDevice = async () => {
        const token = await this.getToken();

        const response = await this.unregisterToken(token);

        this._registeredToken = undefined;

        return response;
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

    startTokenRefreshSubscription = () => {
        if (this._unsubscribeTokenRefresh) {
            return;
        }

        this._unsubscribeTokenRefresh = this.messaging.onUpdateToken(this.onTokenRefresh);
    };

    stopTokenRefreshSubscription = () => {
        if (!this._unsubscribeTokenRefresh) {
            return;
        }

        this._unsubscribeTokenRefresh();
        this._unsubscribeTokenRefresh = undefined;
    };

    subscribeBackground = () => {
        this.messaging.subscribeAppOnBackgroundMessages(this.onBackgroundNotification);
    };

    private onTokenRefresh = async (token: string) => {
        await this.registerToken(token);
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
