import { MMKV } from 'react-native-mmkv';
import { IStorage } from '.';

class MMKVStorage implements IStorage {
    private storage!: MMKV;

    constructor() {
        this.storage = new MMKV();
    }

    cleanAll = (services: string[]) => {
        services.forEach(service => this.storage.delete(service));
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
            console.warn('MMKVStorage -> set: ', error);
            return false;
        }
    };

    remove = (service: string) => {
        try {
            this.storage.delete(service);
            return true;
        } catch (error) {
            console.warn('MMKVStorage -> remove: ', error);
            return false;
        }
    };
}

export const storage = new MMKVStorage();
