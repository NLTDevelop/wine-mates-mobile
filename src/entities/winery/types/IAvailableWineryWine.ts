import { IMedia } from '@/entities/media/types/IMedia';

export interface IAvailableWineryWine {
    id: number;
    name: string;
    vintage: number | null;
    producer: string | null;
    grapeVariety: string | null;
    color: {
        id: number;
        name: string;
        colorHex: string;
    };
    type: {
        id: number;
        name: string;
        isSparkling: boolean;
    };
    country: {
        id: number;
        name: string;
    };
    region: {
        id: number;
        name: string;
    } | null;
    image: IMedia | null;
}

export interface IAvailableWineryWineList {
    count: number;
    rows: IAvailableWineryWine[];
}
