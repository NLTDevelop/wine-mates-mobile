import { MobXRepository } from '@/repository/MobXRepository';
import { IWineBase } from './types/IWineBase';
import { IWineLook } from './types/IWineLook';
import { IWineColorShade } from './types/IWineColorShade';
import { IWineType } from './types/IWineType';
import { IWineColor } from './types/IWineColors';

export interface IWineListModel {
    base: IWineBase | null;
    look: IWineLook | null;
    colorsShades: IWineColorShade[] | null;
    wineTypes: IWineType[] | null;
    colors: IWineColor[] | null;
    clear: () => void;
}

class WineModel implements IWineListModel {
    private baseRepository = new MobXRepository<IWineBase | null>(null);
    private lookRepository = new MobXRepository<IWineLook | null>(null);
    private colorsShadesRepository = new MobXRepository<IWineColorShade[] | null>(null);
    private typesRepository = new MobXRepository<IWineType[] | null>(null);
    private colorsRepository = new MobXRepository<IWineColor[] | null>(null);

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

    public get wineTypes() {
        return this.typesRepository.data;
    }

    public set wineTypes(value: IWineType[] | null) {
        this.typesRepository.save(value);
    }

    public get colors() {
        return this.colorsRepository.data;
    }

    public set colors(value: IWineColor[] | null) {
        this.colorsRepository.save(value);
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
        this.colors = null;
        this.colorsShades = null;
    }
}

export const wineModel = new WineModel();
