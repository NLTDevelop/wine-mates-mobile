import { MobXRepository } from "@/repository/MobXRepository";
import { IWineListItem } from "../types/IWineListItem";
import { IList } from "@/entities/IList";

export interface IWineListModel {
    list: IList<IWineListItem> | null;
    appened: (value: IList<IWineListItem>) => void;
}

class WineListModel implements IWineListModel {
    private listRepository = new MobXRepository<IList<IWineListItem> | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IList<IWineListItem> | null) {
        this.listRepository.save(value);
    }

    public appened(value: IList<IWineListItem>) {
        if (this.list) {
            this.list = {
                ...this.list,
                rows: [...this.list.rows, ...value.rows],
            };
        }
    }
}

export const wineListModel = new WineListModel();
