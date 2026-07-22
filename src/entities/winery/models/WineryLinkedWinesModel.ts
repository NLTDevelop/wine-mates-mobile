import { IList } from '@/entities/IList';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { MobXRepository } from '@/repository/MobXRepository';

interface IWineryLinkedWinesModel {
    list: IList<IWineListItem> | null;
    append: (value: IList<IWineListItem>) => void;
}

class WineryLinkedWinesModel implements IWineryLinkedWinesModel {
    private listRepository = new MobXRepository<IList<IWineListItem> | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IList<IWineListItem> | null) {
        this.listRepository.save(value);
    }

    public append(value: IList<IWineListItem>) {
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

export const wineryLinkedWinesModel = new WineryLinkedWinesModel();
