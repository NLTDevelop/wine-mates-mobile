import { MobXRepository } from '@/repository/MobXRepository';
import { IFavoriteWineList } from './types/IFavoriteWineList';
import { IList } from '../IList';
import { IWineListItem } from './types/IWineListItem';

export interface IFavoriteWinesListModel {
    lists: IFavoriteWineList[] | null;
    currentListId: number | null;
    currentListWines: IList<IWineListItem> | null;
    setLists: (value: IFavoriteWineList[]) => void;
    addList: (value: IFavoriteWineList) => void;
    updateList: (id: number, value: IFavoriteWineList) => void;
    removeList: (id: number) => void;
    setCurrentListId: (id: number | null) => void;
    setCurrentListWines: (value: IList<IWineListItem>) => void;
    appendCurrentListWines: (value: IList<IWineListItem>) => void;
    removeWineFromCurrentList: (wineId: number) => void;
    clear: () => void;
    clearCurrentList: () => void;
}

class FavoriteWinesListModel implements IFavoriteWinesListModel {
    private listsRepository = new MobXRepository<IFavoriteWineList[] | null>(null);
    private currentListIdRepository = new MobXRepository<number | null>(null);
    private currentListWinesRepository = new MobXRepository<IList<IWineListItem> | null>(null);

    public get lists() {
        return this.listsRepository.data;
    }

    public set lists(value: IFavoriteWineList[] | null) {
        this.listsRepository.save(value);
    }

    public get currentListId() {
        return this.currentListIdRepository.data;
    }

    public set currentListId(value: number | null) {
        this.currentListIdRepository.save(value);
    }

    public get currentListWines() {
        return this.currentListWinesRepository.data;
    }

    public set currentListWines(value: IList<IWineListItem> | null) {
        this.currentListWinesRepository.save(value);
    }

    public setLists(value: IFavoriteWineList[]) {
        this.listsRepository.save(value);
    }

    public addList(value: IFavoriteWineList) {
        if (this.lists) {
            this.lists = [...this.lists, value];
        } else {
            this.lists = [value];
        }
    }

    public updateList(id: number, value: IFavoriteWineList) {
        if (this.lists) {
            this.lists = this.lists.map(list => (list.id === id ? value : list));
        }
    }

    public removeList(id: number) {
        if (this.lists) {
            this.lists = this.lists.filter(list => list.id !== id);
        }
        if (this.currentListId === id) {
            this.clearCurrentList();
        }
    }

    public setCurrentListId(id: number | null) {
        this.currentListIdRepository.save(id);
    }

    public setCurrentListWines(value: IList<IWineListItem>) {
        this.currentListWinesRepository.save(value);
    }

    public appendCurrentListWines(value: IList<IWineListItem>) {
        if (this.currentListWines) {
            this.currentListWines = {
                ...this.currentListWines,
                rows: [...this.currentListWines.rows, ...value.rows],
            };
        }
    }

    public removeWineFromCurrentList(wineId: number) {
        if (this.currentListWines) {
            this.currentListWines = {
                ...this.currentListWines,
                count: this.currentListWines.count - 1,
                rows: this.currentListWines.rows.filter(wine => wine.id !== wineId),
            };
        }
    }

    public clear() {
        this.lists = null;
        this.clearCurrentList();
    }

    public clearCurrentList() {
        this.currentListId = null;
        this.currentListWines = null;
    }
}

export const favoriteWinesListModel = new FavoriteWinesListModel();
