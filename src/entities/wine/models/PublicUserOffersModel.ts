import { IList } from '@/entities/IList';
import { IOfferedWineListItem } from '@/entities/wine/types/IOfferedWineListItem';
import { MobXRepository } from '@/repository/MobXRepository';

interface IPublicUserOffersModel {
    list: IList<IOfferedWineListItem> | null;
    append: (value: IList<IOfferedWineListItem>) => void;
}

class PublicUserOffersModel implements IPublicUserOffersModel {
    private listRepository = new MobXRepository<IList<IOfferedWineListItem> | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IList<IOfferedWineListItem> | null) {
        this.listRepository.save(value);
    }

    public append(value: IList<IOfferedWineListItem>) {
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

export const publicUserOffersModel = new PublicUserOffersModel();
