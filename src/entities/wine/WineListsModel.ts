import { MobXRepository } from '@/repository/MobXRepository';
import { IList } from '../IList';
import { IWineListItem } from './types/IWineListItem';
import { IWineFilters } from './types/IWineFilters';
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
    clear: () => void;
    append: (value: IList<IWineListItem>) => void;
    clearFilters: () => void;
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
        return this.filtersRepository.rawData || {
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
   
    public clear() {
        this.list = null;
    }

    public clearFilters() {
        const currentFilters = this.filtersRepository.rawData;
        if (currentFilters) {
            currentFilters.sort = [];
            currentFilters.colors = [];
            currentFilters.types = [];
        }
    }

    public setSort(value: (string | number)[]) {
        const currentFilters = this.filtersRepository.rawData;
        if (currentFilters) {
            currentFilters.sort = value;
        }
    }

    public setColors(value: (string | number)[]) {
        const currentFilters = this.filtersRepository.rawData;
        if (currentFilters) {
            currentFilters.colors = value;
        }
    }

    public setTypes(value: (string | number)[]) {
        const currentFilters = this.filtersRepository.rawData;
        if (currentFilters) {
            currentFilters.types = value;
        }
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

export const wineListsModel = new WineListsModel();
