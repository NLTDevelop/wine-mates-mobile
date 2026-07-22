import { IList } from '@/entities/IList';
import { MobXRepository } from '@/repository/MobXRepository';
import { IClientNotification } from './types/IClientNotification';

interface INotificationsCountState {
    token: string | null;
    count: number;
}

export interface INotificationsModel {
    notifications: IList<IClientNotification> | null;
    readonly notificationsCount: number;
    notificationsCountState: INotificationsCountState;
    append: (value: IList<IClientNotification>) => void;
}

class NotificationsModel implements INotificationsModel {
    private notificationsRepository = new MobXRepository<IList<IClientNotification> | null>(null);
    private notificationsCountRepository = new MobXRepository<INotificationsCountState>({ token: null, count: 0 });

    public get notifications() {
        return this.notificationsRepository.data;
    }

    public set notifications(value: IList<IClientNotification> | null) {
        this.notificationsRepository.save(value);
    }

    public get notificationsCount() {
        return this.notificationsCountRepository.data?.count || 0;
    }

    public get notificationsCountState() {
        return this.notificationsCountRepository.data || { token: null, count: 0 };
    }

    public set notificationsCountState(value: INotificationsCountState) {
        this.notificationsCountRepository.save(value);
    }

    public append(value: IList<IClientNotification>) {
        if (this.notifications) {
            this.notifications = {
                ...this.notifications,
                ...value,
                rows: [...this.notifications.rows, ...value.rows],
            };
            return;
        }

        this.notifications = value;
    }
}

export const notificationsModel = new NotificationsModel();
