import { MobXRepository } from '@/repository/MobXRepository';
import { IWineBase } from './types/IWineBase';
import { IWineLook } from './types/IWineLook';
import { IWineColorShade } from './types/IWineColorShade';

export interface IWineListModel {
    base: IWineBase | null;
    look: IWineLook | null;
    colorsShades: IWineColorShade[] | null;
    clear: () => void;
}

class WineModel implements IWineListModel {
    private baseRepository = new MobXRepository<IWineBase | null>(null);
    private lookRepository = new MobXRepository<IWineLook | null>(null);
    private colorsShadesRepository = new MobXRepository<IWineColorShade[] | null>(null);

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

    public get colorsShades() {
        return this.colorsShadesRepository.data;
    }

    public set colorsShades(value: IWineColorShade[] | null) {
        this.colorsShadesRepository.save(value);
    }

    public clear() {
        this.base = null;
        this.look = null;
        this.colorsShades = null;
    }
}

export const wineModel = new WineModel();
