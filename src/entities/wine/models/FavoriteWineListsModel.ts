import { MobXRepository } from '@/repository/MobXRepository';
import { IFavoriteWineList } from '../types/IFavoriteWineList';
import { IWineListItem } from '../types/IWineListItem';
import { IList } from '@/entities/IList';

export interface IFavoriteWinesListModel {
    lists: IFavoriteWineList[] | null;
    currentListId: number | null;
    currentListWines: IList<IWineListItem> | null;
    append: (value: IList<IWineListItem>) => void;
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

    public append(value: IList<IWineListItem>) {
        if (this.currentListWines) {
            this.currentListWines = {
                ...this.currentListWines,
                rows: [...this.currentListWines.rows, ...value.rows],
            };
        }
    }
}

export const favoriteWinesListModel = new FavoriteWinesListModel();
