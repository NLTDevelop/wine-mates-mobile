import { MobXRepository } from '@/repository/MobXRepository';
import { ISubscriptions } from './types/ISubscription';

export interface ISubscriptionsModel {
    list: ISubscriptions | null;
}

class SubscriptionsModel implements ISubscriptionsModel {
    private listRepository = new MobXRepository<ISubscriptions | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: ISubscriptions | null) {
        this.listRepository.save(value);
    }
}

export const subscriptionsModel = new SubscriptionsModel();
