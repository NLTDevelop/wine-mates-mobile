import { IList } from '@/entities/IList';
import { IWineryLinkedWine } from '../types/IWineryLinkedWine';
import { MobXRepository } from '@/repository/MobXRepository';

interface IWineryLinkedWinesModel {
    list: IList<IWineryLinkedWine> | null;
    append: (value: IList<IWineryLinkedWine>) => void;
}

class WineryLinkedWinesModel implements IWineryLinkedWinesModel {
    private listRepository = new MobXRepository<IList<IWineryLinkedWine> | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IList<IWineryLinkedWine> | null) {
        this.listRepository.save(value);
    }

    public append(value: IList<IWineryLinkedWine>) {
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
