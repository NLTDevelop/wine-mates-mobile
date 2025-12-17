import { createMMKV, type MMKV } from 'react-native-mmkv';
import { IStorage } from '.';

export class MMKVStorage implements IStorage {
    private storage: MMKV;

    constructor() {
        this.storage = createMMKV();
    }

    cleanAll = (services: string[]) => {
        services.forEach(service => {
            this.storage.remove(service);
        });
    };

    cleanOnFirstLaunch = (servicesArray: string[]) => {
        if (!this.storage.getBoolean('hasLaunchedBefore')) {
            this.cleanAll(servicesArray);
            this.storage.set('hasLaunchedBefore', true);
        }
    };

    get = (service: string) => {
        const payload = this.storage.getString(service);
        return payload ? JSON.parse(payload) : null;
    };

    set = (service: string, payload: object | string | number | boolean) => {
        try {
            this.storage.set(service, JSON.stringify(payload));
            return true;
        } catch (error) {
            console.error('MMKVStorage -> set:', error);
            return false;
        }
    };

    remove = (service: string) => {
        try {
            this.storage.remove(service);
            return true;
        } catch (error) {
            console.error('MMKVStorage -> remove:', error);
            return false;
        }
    };
}

export const storage = new MMKVStorage();
