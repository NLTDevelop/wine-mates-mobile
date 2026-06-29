import { IMedia } from '@/entities/media/types/IMedia';

interface IWineSetSearchLocalizedName {
    language?: string | null;
    value?: string | null;
}

interface IWineSetSearchNamedValue {
    name?: string | IWineSetSearchLocalizedName[] | null;
}

interface IWineSetSearchType extends IWineSetSearchNamedValue {
    id?: number;
    isSparkling?: boolean;
}

interface IWineSetSearchColor extends IWineSetSearchNamedValue {
    id?: number;
    colorHex?: string | null;
}

export interface IWineSetSearchItem {
    id: number;
    name: string;
    producer?: string | null;
    vintage?: number | null;
    grapeVariety?: string | null;
    country?: string | IWineSetSearchNamedValue | null;
    region?: string | IWineSetSearchNamedValue | null;
    type?: IWineSetSearchType | null;
    color?: IWineSetSearchColor | null;
    image?: IMedia | null;
}
