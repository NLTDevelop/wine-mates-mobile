import { MobXRepository } from '@/repository/MobXRepository';
import { IWineBase } from './types/IWineBase';
import { IWineLook } from './types/IWineLook';

export interface IWineListModel {
    base: IWineBase | null;
    look: IWineLook | null;
    clear: () => void;
}

class WineModel implements IWineListModel {
    private baseRepository = new MobXRepository<IWineBase | null>(null);
    private lookRepository = new MobXRepository<IWineLook | null>(null);

    public get base() {
        return this.baseRepository.data;
    }

    public set base(value: IWineBase | null) {
        this.baseRepository.save(value);
    }

    public get look() {
        return this.lookRepository.data;
    }

    public set look(value: IWineLook | null) {
        this.lookRepository.save(value);
    }

    public clear() {
        this.base = null;
        this.look = null;
    }
}

export const wineModel = new WineModel();
