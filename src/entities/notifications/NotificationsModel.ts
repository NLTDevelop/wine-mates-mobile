import { IList } from '@/entities/IList';
import { MobXRepository } from '@/repository/MobXRepository';
import { IClientNotification } from './types/IClientNotification';

export interface INotificationsModel {
    notifications: IList<IClientNotification> | null;
    notificationsCount: number;
    append: (value: IList<IClientNotification>) => void;
}

class NotificationsModel implements INotificationsModel {
    private notificationsRepository = new MobXRepository<IList<IClientNotification> | null>(null);
    private notificationsCountRepository = new MobXRepository<number>(0);

    public get notifications() {
        return this.notificationsRepository.data;
    }

    public set notifications(value: IList<IClientNotification> | null) {
        this.notificationsRepository.save(value);
    }

    public get notificationsCount() {
        return this.notificationsCountRepository.data || 0;
    }

    public set notificationsCount(value: number) {
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
