import { IMedia } from '@/entities/media/types/IMedia';
import { IWineTasteCharacteristic } from './IWineTasteCharacteristic';

export interface IStatistic {
    id: number;
    colorHex: string | null;
    name: string;
    userCount: number;
}

export interface IVintage {
    wineId: number;
    vintage: number;
    averageUserRating: number;
    totalReviews: number;
}

export interface IWineDetails {
    id: number;
    name: string;
    vintage: number;
    isTasted: boolean;
    vintages: IVintage[];
    producer: string | null;
    grapeVariety: string;
    userId: number;
    searchVector: string;
    createdAt: string;
    image: IMedia | null;
    averageUserRating: number;
    averageExpertRating: number;
    totalReviews: number;
    color: {
        id: number;
        colorHex: string;
        name: string;
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
    statistics: {
        topColor: {
            id: number;
            colorHex: string;
            name: string;
        };
        topAromas: IStatistic[];
        topFlavors: IStatistic[];
        tasteCharacteristics: IWineTasteCharacteristic[];
    };
}
