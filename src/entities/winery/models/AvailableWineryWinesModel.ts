import { MobXRepository } from '@/repository/MobXRepository';
import { IAvailableWineryWineList } from '../types/IAvailableWineryWine';

interface IAvailableWineryWinesModel {
    list: IAvailableWineryWineList | null;
    append: (value: IAvailableWineryWineList) => void;
}

class AvailableWineryWinesModel implements IAvailableWineryWinesModel {
    private listRepository = new MobXRepository<IAvailableWineryWineList | null>(null);

    public get list() {
        return this.listRepository.data;
    }

    public set list(value: IAvailableWineryWineList | null) {
        this.listRepository.save(value);
    }

    public append(value: IAvailableWineryWineList) {
        if (!this.list) {
            return;
        }

        this.list = {
            ...value,
            rows: [...this.list.rows, ...value.rows],
        };
    }
}

export const availableWineryWinesModel = new AvailableWineryWinesModel();
