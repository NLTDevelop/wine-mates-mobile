import { IStorage, storage } from '@/libs/storage';
import { MobXRepository } from '@/repository/MobXRepository';
import { IAddEventCreateDraftCache } from '@/modules/event/types/IAddEventCreateDraftCache';
import { userModel } from '@/entities/users/UserModel';

const ADD_EVENT_CREATE_DRAFT_CACHE_KEY = 'ADD_EVENT_CREATE_DRAFT_CACHE';
const UNKNOWN_USER_CACHE_KEY = 'unknown';

const getCacheUserKey = () => {
    const userId = userModel.user?.id;

    if (typeof userId === 'number') {
        return `${userId}`;
    }

    return UNKNOWN_USER_CACHE_KEY;
};

class AddEventCreateDraftCacheModel {
    private stateRepository = new MobXRepository<IAddEventCreateDraftCache | null>(null);
    private cacheUserKey = getCacheUserKey();

    constructor(private _storage: IStorage) {
        this.load();
    }

    private get storageKey() {
        return `${ADD_EVENT_CREATE_DRAFT_CACHE_KEY}_${this.cacheUserKey}`;
    }

    private load = () => {
        this.cacheUserKey = getCacheUserKey();
        const cachedDraft = this._storage.get(this.storageKey) as IAddEventCreateDraftCache | null;

        this.stateRepository.save(cachedDraft || null);
    };

    public syncUser = () => {
        const nextCacheUserKey = getCacheUserKey();

        if (nextCacheUserKey === this.cacheUserKey) {
            return;
        }

        this.cacheUserKey = nextCacheUserKey;
        const cachedDraft = this._storage.get(this.storageKey) as IAddEventCreateDraftCache | null;
        this.stateRepository.save(cachedDraft || null);
    };

    private persist = (value: IAddEventCreateDraftCache | null) => {
        if (value) {
            this._storage.set(this.storageKey, value);
            return;
        }

        this._storage.remove(this.storageKey);
    };

    public get state() {
        return this.stateRepository.data;
    }

    public set state(value: IAddEventCreateDraftCache | null) {
        this.stateRepository.save(value);
        this.persist(value);
    }

    public clear() {
        this.state = null;
    }
}

export const addEventCreateDraftCacheModel = new AddEventCreateDraftCacheModel(storage);
