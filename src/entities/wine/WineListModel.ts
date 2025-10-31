import { MobXRepository } from "@/repository/MobXRepository";
import { IList } from "../IList";
import { IWineListItem } from "./types/IWineListItem";

export interface IWineListModel {
    list: IList<IWineListItem> | null;
    clear: () => void;
    append: (value: IList<IWineListItem>) => void;
}

class WineListModel implements IWineListModel {
    private listRepository = new MobXRepository<IList<IWineListItem> | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IList<IWineListItem> | null) {
        this.listRepository.save(value);
    }

    public clear() {
        this.list = null;
    }

    public append(value: IList<IWineListItem>) {
        if (this.list) {
            this.list = {
                ...this.list,
                data: [...this.list.data, ...value.data],
            };
        }
    }

    public setList(value: IList<IWineListItem>) {
        this.listRepository.save(value);
    }
}

export const wineListModel = new WineListModel();
