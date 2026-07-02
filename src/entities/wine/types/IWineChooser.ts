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

export interface IWineChooserVintage {
    vintage: number | null;
    wineCount: number;
    avgUserRating?: number | null;
    avgExpertRating?: number | null;
}

export interface IWineChooserFilterOptionVintage {
    id: number | null;
    wineCount?: number;
}

export interface IWineChooserFilterOptionGrapeVariety {
    name: string;
    wineCount?: number;
}

export interface IWineChooserFilterOptionRatings {
    minUserRating?: number;
    minExpertRating?: number;
    maxExpertRating?: number;
}

export interface IWineChooserFilterOptionTasteCharacteristic {
    id: number;
    name: string;
    minSortNumber: number;
    maxSortNumber: number;
    description?: string | null;
    colorHex?: string;
    isPremium: boolean;
    qtyLevels: number;
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
    gender?: WineChooserGender;
    ageMin?: number | null;
    ageMax?: number | null;
    grapeVariety?: string | null;
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
    vintages: (number | null)[];
    tasteFilters: IWineChooserTasteFilter[];
}

export type IWineChooserRequest = Partial<IWineChooserFilters> & {
    offset: number;
    limit: number;
};

export type IWineChooserFilterOptionsRequest = Partial<IWineChooserRequest>;

export interface IGenderOption {
    value: WineChooserGender;
    wineCount: number;
}

export interface IWineChooserFilterOptions {
    countries: IWineChooserOption[];
    regions: IWineChooserOption[];
    types: IWineChooserOption[];
    colors: IWineChooserOption[];
    vintages: IWineChooserFilterOptionVintage[];
    grapeVarieties: IWineChooserFilterOptionGrapeVariety[];
    aromas: IWineChooserOption[];
    flavors: IWineChooserOption[];
    ratings?: IWineChooserFilterOptionRatings;
    tasteCharacteristics: IWineChooserFilterOptionTasteCharacteristic[];
    genderOptions: IGenderOption[];
    ageRange?: {
        minAge: number;
        maxAge: number;
    };
}

export type IWineChooserList = IList<IWineListItem>;
