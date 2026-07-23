import { IUserTastingsList } from '@/entities/wine/types/IUserTastingsList';
import { MobXRepository } from '@/repository/MobXRepository';

interface IUserTastingsModel {
    list: IUserTastingsList | null;
    append: (value: IUserTastingsList) => void;
}

class UserTastingsModel implements IUserTastingsModel {
    private listRepository = new MobXRepository<IUserTastingsList | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IUserTastingsList | null) {
        this.listRepository.save(value);
    }

    public append(value: IUserTastingsList) {
        if (!this.list) {
            this.list = value;
            return;
        }

        this.list = {
            ...value,
            rows: [...this.list.rows, ...value.rows],
        };
    }
}

export const userTastingsModel = new UserTastingsModel();
