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
    vintage: number | null;
    averageUserRating: number;
    totalReviews: number;
}

export interface IColorShade {
    colorHex: string;
    userCount: number;
}

export interface IColorStatistic {
    id: number;
    colorHex: string;
    name: string;
    pale: IColorShade;
    medium: IColorShade;
    deep: IColorShade;
}

export interface IWinePeakStatistic {
    year: number;
    userCount: number;
}

export interface IOverallVintageScore {
    averageUserRating: number;
    totalReviews: number;
}

export interface IWineDetails {
    id: number;
    name: string | null;
    vintage: number | null;
    currentVintage: IVintage | null;
    isTasted: boolean;
    vintages: IVintage[];
    overallVintageScore: IOverallVintageScore;
    producer: string | null;
    grapeVariety: string;
    userId: number;
    searchVector: string;
    createdAt: string;
    image: IMedia | null;
    averageUserRating: number;
    averageExpertRating: number;
    countExpertRating: number;
    countUserRating: number;
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
        topColors: IColorStatistic[];
        topAromas: IStatistic[];
        topFlavors: IStatistic[];
        tasteCharacteristics: IWineTasteCharacteristic[];
        topWinePeaks: IWinePeakStatistic[];
    };
}
