import { IList } from "@/entities/IList";
import { MobXRepository } from "@/repository/MobXRepository";
import { IWineReviewsListItem } from "../types/IWineReviewsListItem";

export interface IWineReviewsListModel {
    list: IList<IWineReviewsListItem> | null;
    appened: (value: IList<IWineReviewsListItem>) => void;
}

class WineReviewsListModel implements IWineReviewsListModel {
    private listRepository = new MobXRepository<IList<IWineReviewsListItem> | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IList<IWineReviewsListItem> | null) {
        this.listRepository.save(value);
    }

    public appened(value: IList<IWineReviewsListItem>) {
        if (this.list) {
            this.list = {
                ...this.list,
                rows: [...this.list.rows, ...value.rows],
            };
        }
    }
}

export const wineReviewsListModel = new WineReviewsListModel();
