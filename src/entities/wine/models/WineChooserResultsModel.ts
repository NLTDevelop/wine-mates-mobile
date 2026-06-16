import { MobXRepository } from '@/repository/MobXRepository';
import { IWineChooserList } from '../types/IWineChooser';

export class WineChooserResultsModel {
    private listRepository = new MobXRepository<IWineChooserList | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IWineChooserList | null) {
        this.listRepository.save(value);
    }

    public append(value: IWineChooserList) {
        if (this.list) {
            this.list = {
                ...value,
                rows: [...this.list.rows, ...value.rows],
            };
        }
    }
}

export const wineChooserResultsModel = new WineChooserResultsModel();
