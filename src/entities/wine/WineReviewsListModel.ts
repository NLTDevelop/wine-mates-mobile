import { MobXRepository } from "@/repository/MobXRepository";
import { IList } from "../IList";
import { IWineReviewsListItem } from "./types/IWineReviewsListItem";

export interface IWineReviewsListModel {
    list: IList<IWineReviewsListItem> | null;
    clear: () => void;
    append: (value: IList<IWineReviewsListItem>) => void;
}

class WineReviewsListModel implements IWineReviewsListModel {
    private listRepository = new MobXRepository<IList<IWineReviewsListItem> | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IList<IWineReviewsListItem> | null) {
        this.listRepository.save(value);
    }

    public clear() {
        this.list = null;
    }

    public append(value: IList<IWineReviewsListItem>) {
        if (this.list) {
            this.list = {
                ...this.list,
                rows: [...this.list.rows, ...value.rows],
            };
        }
    }

    public setList(value: IList<IWineReviewsListItem>) {
        this.listRepository.save(value);
    }
}

export const wineReviewsListModel = new WineReviewsListModel();
