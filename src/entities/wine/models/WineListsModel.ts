import { MobXRepository } from '@/repository/MobXRepository';
import { IWineListItem } from '../types/IWineListItem';
import { IWineFilters } from '../types/IWineFilters';
import { IList } from '@/entities/IList';
export interface ISelectedFilters {
    sort: (string | number)[];
    colors: (string | number)[];
    types: (string | number)[];
}

export interface IWineListsModel {
    list: IList<IWineListItem> | null;
    search: string;
    filters: ISelectedFilters;
    filtersData: IWineFilters | null;
    append: (value: IList<IWineListItem>) => void;
}

class WineListsModel implements IWineListsModel {
    private listRepository = new MobXRepository<IList<IWineListItem> | null>(null);
    private searchRepository = new MobXRepository<string>('');
    private filtersRepository = new MobXRepository<ISelectedFilters>({
        sort: [],
        colors: [],
        types: [],
    });
    private filtersDataRepository = new MobXRepository<IWineFilters | null>(null);

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

    public get filters() {
        return this.filtersRepository.data || {
            sort: [],
            colors: [],
            types: [],
        };
    }

    public set filters(value: ISelectedFilters) {
        this.filtersRepository.save(value);
    }

    public get filtersData() {
        return this.filtersDataRepository.data;
    }

    public set filtersData(value: IWineFilters | null) {
        this.filtersDataRepository.save(value);
    }
   
    public append(value: IList<IWineListItem>) {
        if (this.list) {
            this.list = {
                ...this.list,
                rows: [...this.list.rows, ...value.rows],
            };
        }
    }
}

export const wineListsModel = new WineListsModel();
