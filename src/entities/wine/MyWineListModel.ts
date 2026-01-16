import { MobXRepository } from '@/repository/MobXRepository';
import { IList } from '../IList';
import { IWineListItem } from './types/IWineListItem';

export interface IMyWineListModel {
    list: IList<IWineListItem> | null;
    search: string;
    clear: () => void;
    append: (value: IList<IWineListItem>) => void;
}

class MyWineListModel implements IMyWineListModel {
    private listRepository = new MobXRepository<IList<IWineListItem> | null>(null);
    private searchRepository = new MobXRepository<string>('');

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IList<IWineListItem> | null) {
        this.listRepository.save(value);
    }

    public get search() {
        return this.searchRepository.data || '';
    }

    public set search(value: string) {
        this.searchRepository.save(value);
    }
   
    public clear() {
        this.list = null;
    }

    public append(value: IList<IWineListItem>) {
        if (this.list) {
            this.list = {
                ...this.list,
                rows: [...this.list.rows, ...value.rows],
            };
        }
    }

    public setList(value: IList<IWineListItem>) {
        this.listRepository.save(value);
    }
}

export const myWineListModel = new MyWineListModel();
