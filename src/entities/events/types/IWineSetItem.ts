import { IMedia } from '@/entities/media/types/IMedia';

interface ILocalizedWineSetName {
    language?: string | null;
    value?: string | null;
}

interface IWineSetNamedValue {
    id: number;
    name: string | ILocalizedWineSetName[];
}

interface IWineSetType extends IWineSetNamedValue {
    isSparkling: boolean;
}

interface IWineSetColor extends IWineSetNamedValue {
    colorHex?: string | null;
}

interface IWineSetVintage {
    wineId: number;
    vintage: number | null;
}

export interface IWineInSet {
    id: number;
    name: string;
    producer?: string;
    vintage?: number;
    grapeVariety?: string | null;
    image?: IMedia | null;
    defaultImage?: IMedia | null;
    type?: IWineSetType | null;
    country?: IWineSetNamedValue | null;
    region?: IWineSetNamedValue | null;
    color?: IWineSetColor | null;
    vintages?: IWineSetVintage[];
}

export type WineSetTastingStatus = 'not_started' | 'in_progress' | 'tasted' | 'missed';

export interface IWineSetItem {
    id: number;
    wineId: number;
    sortOrder: number;
    wine: IWineInSet;
    tastingStatus?: WineSetTastingStatus;
    avgUserRating?: number | null;
    avgExpertRating?: number | null;
}
