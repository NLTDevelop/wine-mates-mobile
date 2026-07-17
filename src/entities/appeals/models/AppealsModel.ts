import { IList } from '@/entities/IList';
import { MobXRepository } from '@/repository/MobXRepository';
import { IAppeal } from '../types/IAppeal';

interface IAppealsModel {
    list: IList<IAppeal> | null;
    append: (value: IList<IAppeal>) => void;
}

class AppealsModel implements IAppealsModel {
    private listRepository = new MobXRepository<IList<IAppeal> | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IList<IAppeal> | null) {
        this.listRepository.save(value);
    }

    public append(value: IList<IAppeal>) {
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

export const appealsModel = new AppealsModel();
