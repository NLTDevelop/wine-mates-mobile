import { deleteToken, getAPNSToken, getInitialNotification, getMessaging, getToken, hasPermission, isDeviceRegisteredForRemoteMessages, onMessage, onNotificationOpenedApp, onTokenRefresh, registerDeviceForRemoteMessages, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import { IMessaging } from './IMessaging';

export class FirebaseMessaging implements IMessaging {

    private _messaging?: ReturnType<typeof getMessaging>;

    private get messaging() {
        if (!this._messaging) {
            this._messaging = getMessaging();
        }

        return this._messaging;
    }

    requestUserPermission = async (): Promise<number> => {
        try {
            const result = await hasPermission(this.messaging);
            return result;
        } catch (error) {
            console.warn('FirebaseMessaging -> requestUserPermission: ', error);
            return 0;
        }
    }

    registerAppWithFCM = async (): Promise<void> => {
        try {
            await this.requestUserPermission();
            if (!isDeviceRegisteredForRemoteMessages(this.messaging)) {
                await registerDeviceForRemoteMessages(this.messaging);
            }
        } catch (error) {
            console.warn('FirebaseMessaging -> registerAppWithFCM: ', error);
        }
    };

    getFCMToken = async (): Promise<string> => {
        try {
            const FCMToken = await getToken(this.messaging);
            return FCMToken;
        } catch (error) {
            console.warn('FirebaseMessaging -> getFCMToken: ', error);
            return '';
        }
    }

    getAPNSToken = async (): Promise<string | null> => {
        try {
            return getAPNSToken(this.messaging);
        } catch (error) {
            console.warn('FirebaseMessaging -> getAPNSToken: ', error);
            return null;
        }
    }

    onUpdateToken = (callBack: Function): (() => void) => {
        const unsubscribe = onTokenRefresh(this.messaging, async token => await callBack(token));
        return unsubscribe;
    }

    removeFCMToken = async (): Promise<void> => {
        try {
            await deleteToken(this.messaging);
        } catch (error) {
            console.warn('FirebaseMessaging -> removeFCMToken: ', error);
        }
    }

    subscribeAppOnBackgroundMessages = (callBack: Function) => {
        try {
            setBackgroundMessageHandler(this.messaging, async remoteMessage => {
                if (remoteMessage) {
                    await callBack(remoteMessage);
                }
            });
        } catch (error) {
            console.warn('FirebaseMessaging -> subscribeAppOnBackgroundMessages: ', error);
        }
    };

    subscribeAppOnForegroundMessages = (callBack: Function): Function => {
        try {
            const unsubscribeOnOpenedApp = onNotificationOpenedApp(this.messaging, remoteMessage => {
                if (remoteMessage) {
                    callBack(remoteMessage, 'onNotificationOpenedApp');
                }
            });

            getInitialNotification(this.messaging).then(remoteMessage => {
                if (remoteMessage) {
                    callBack(remoteMessage, 'getInitialNotification');
                }
            });

            const unsubscribe = onMessage(this.messaging, async remoteMessage => {
                if (remoteMessage) {
                    callBack(remoteMessage, 'onMessage');
                }
            });

            return () => {
                unsubscribe();
                unsubscribeOnOpenedApp()
            };
        } catch (error) {
            console.warn('FirebaseMessaging -> subscribeAppOnForegroundMessages: ', error);
            return () => undefined;
        }
    };

}
