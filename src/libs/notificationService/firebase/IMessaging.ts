export interface IMessaging {
    requestUserPermission: () => Promise<number>;
    registerAppWithFCM: () => Promise<void>;
    getFCMToken: () => Promise<string>;
    getAPNSToken: () => Promise<string | null>;
    removeFCMToken: () => Promise<void>;
    subscribeAppOnForegroundMessages: (callback: Function) => Function;
    subscribeAppOnBackgroundMessages: (callback: Function) => void;
    onUpdateToken: (callback: Function) => () => void;
}
