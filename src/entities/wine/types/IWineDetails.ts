import { IMedia } from '@/entities/media/types/IMedia';
import { IWineTasteCharacteristic } from './IWineTasteCharacteristic';

export interface IStatistic {
    id: number;
    colorHex: string | null;
    name: string;
    userCount: string;
}

export interface IVintage {
    wineId: number;
    vintage: number;
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
    createdAt: string;
    image: IMedia;
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
    };
    country: {
        id: number;
        name: string;
    };
    region: {
        id: number;
        name: string;
    };
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
