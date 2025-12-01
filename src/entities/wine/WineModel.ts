import { MobXRepository } from '@/repository/MobXRepository';
import { IWineBase } from './types/IWineBase';
import { IWineLook } from './types/IWineLook';
import { IWineColorShade } from './types/IWineColorShade';
import { IWineType } from './types/IWineType';
import { IWineColor } from './types/IWineColors';
import { IWineSmell } from './types/IWineSmell';
import { IWineTaste } from './types/IWineTaste';
import { IWineTasteCharacteristic } from './types/IWineTasteCharacteristic';
import { IWineSelectedSmell } from './types/IWineSelectedSmell';
import { IWineReview } from './types/IWineReview';
import { IWineImage } from './types/IWineImage';
import { IWineAroma } from './types/IWineAroma';

export interface IWineListModel {
    image: IWineImage | null;
    base: IWineBase | null;
    look: IWineLook | null;
    colorsShades: IWineColorShade[] | null;
    smells: IWineSmell[] | null;
    searchedAroma: IWineAroma[] | null;
    selectedSmells: IWineSelectedSmell[] | null;
    wineTypes: IWineType[] | null;
    colors: IWineColor[] | null;
    tastes: IWineTaste[] | null;
    selectedTastes: IWineTaste[] | null;
    tasteCharacteristics: IWineTasteCharacteristic[] | null;
    review: IWineReview | null;
    clear: () => void;
}

class WineModel implements IWineListModel {
    private imageRepository = new MobXRepository<IWineImage | null>(null);
    private baseRepository = new MobXRepository<IWineBase | null>(null);
    private lookRepository = new MobXRepository<IWineLook | null>(null);
    private colorsShadesRepository = new MobXRepository<IWineColorShade[] | null>(null);
    private typesRepository = new MobXRepository<IWineType[] | null>(null);
    private colorsRepository = new MobXRepository<IWineColor[] | null>(null);
    private smellsRepository = new MobXRepository<IWineSmell[] | null>(null);
    private searchedAromasRepository = new MobXRepository<IWineAroma[] | null>(null);
    private selectedSmellsRepository = new MobXRepository<IWineSelectedSmell[] | null>(null);
    private tastesRepository = new MobXRepository<IWineTaste[] | null>(null);
    private selectedTastesRepository = new MobXRepository<IWineTaste[] | null>(null);
    private tasteCharacteristicsRepository = new MobXRepository<IWineTasteCharacteristic[] | null>(null);
    private reviewRepository = new MobXRepository<IWineReview | null>(null);

    public get image() {
        return this.imageRepository.data;
    }

    public set image(value: IWineImage | null) {
        this.imageRepository.save(value);
    }

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

    public get smells() {
        return this.smellsRepository.data;
    }

    public set smells(value: IWineSmell[] | null) {
        this.smellsRepository.save(value);
    }

    public get searchedAroma() {
        return this.searchedAromasRepository.data;
    }

    public set searchedAroma(value: IWineAroma[] | null) {
        this.searchedAromasRepository.save(value);
    }

    public get selectedSmells() {
        return this.selectedSmellsRepository.data;
    }

    public set selectedSmells(value: IWineSelectedSmell[] | null) {
        this.selectedSmellsRepository.save(value);
    }

    public get tastes() {
        return this.tastesRepository.data;
    }

    public set tastes(value: IWineTaste[] | null) {
        this.tastesRepository.save(value);
    }

    public get selectedTastes() {
        return this.selectedTastesRepository.data;
    }

    public set selectedTastes(value: IWineTaste[] | null) {
        this.selectedTastesRepository.save(value);
    }

    public get tasteCharacteristics() {
        return this.tasteCharacteristicsRepository.data;
    }

    public set tasteCharacteristics(value: IWineTasteCharacteristic[] | null) {
        this.tasteCharacteristicsRepository.save(value);
    }

    public get review() {
        return this.reviewRepository.data;
    }

    public set review(value: IWineReview | null) {
        this.reviewRepository.save(value);
    }

    public clear() {
        this.image = null;
        this.base = null;
        this.look = null;
        this.colors = null;
        this.colorsShades = null;
        this.smells = null;
        this.searchedAroma = null;
        this.selectedSmells = null;
        this.tastes = null;
        this.selectedTastes = null;
        this.tasteCharacteristics = null;
        this.review = null;
    }
}

export const wineModel = new WineModel();
