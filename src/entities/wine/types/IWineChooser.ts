import { IList } from '@/entities/IList';
import { IWineListItem } from './IWineListItem';

export type WineChooserMode = 'myself' | 'friend';

export type WineChooserGender = 'male' | 'female' | null;

export interface IWineChooserOption {
    id: number;
    name: string;
    wineCount?: number;
    colorHex?: string;
}

export interface IWineChooserGrapeVariety {
    grapeVariety?: string;
    name?: string;
    wineCount: number;
}

export interface IWineChooserTasteFilter {
    characteristicId: number;
    minSortNumber: number;
    maxSortNumber: number;
}

export interface IWineChooserPrefillTasteCharacteristic {
    characteristicId: number;
    avgSortNumber: number;
}

export interface IWineChooserPrefill {
    countryId?: number;
    typeId?: number;
    colorId?: number;
    tasteCharacteristics?: IWineChooserPrefillTasteCharacteristic[];
}

export interface IWineChooserFilters {
    searchQuery: string;
    aromaIds: number[];
    flavorIds: number[];
    gender: WineChooserGender;
    ageMin: number | null;
    ageMax: number | null;
    typeIds: number[];
    colorIds: number[];
    minUserRating: number;
    minExpertRating: number;
    maxExpertRating: number;
    countryIds: number[];
    regionIds: number[];
    grapeVarieties: string[];
    vintageMin: number | null;
    vintageMax: number | null;
    tasteFilters: IWineChooserTasteFilter[];
}

export interface IWineChooserRequest extends IWineChooserFilters {
    offset: number;
    limit: number;
}

export type IWineChooserList = IList<IWineListItem>;
