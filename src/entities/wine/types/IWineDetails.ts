import { IMedia } from '@/entities/media/types/IMedia';
import { IWineTasteCharacteristic } from './IWineTasteCharacteristic';
import { ISnack } from '@/entities/snacks/types/ISnack';
import { IWineReviewsListItem } from './IWineReviewsListItem';

export interface IStatistic {
    id: number;
    colorHex: string | null;
    name: string;
    userCount: number;
}

export interface IVintage {
    averageExpertRating: number | null;
    averageUserRating: number | null;
    countExpertRating: number;
    countUserRating: number;
    totalReviews: number;
    vintage: number | null;
    wineId: number;
    myRateId?: number | null;
}

export type IVintagesItem = number | string | IVintage;

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
    averageUserRating: number | null;
    totalReviews: number;
}

export interface IWineDetails {
    averageExpertRating: number | null;
    averageUserRating: number | null;
    color: { id: number; colorHex: string; name: string };
    countExpertRating: number;
    countUserRating: number;
    country: { id: number; name: string };
    createdAt: string;
    currentVintage: IVintage | string | null;
    grapeVariety: string;
    id: number;
    image: IMedia | null;
    defaultImage: IMedia | null;
    isTasted: boolean;
    name: string;
    producer: string;
    region: { id: number; name: string };
    searchVector: string;
    statistics: {
        topColors: IColorStatistic[];
        topAromas: IStatistic[];
        topFlavors: IStatistic[];
        tasteCharacteristics: IWineTasteCharacteristic[];
        topWinePeaks: IWinePeakStatistic[];
    };
    type: { id: number; isSparkling: boolean; name: string };
    userId: number;
    vintage: number | null;
    vintages: IVintagesItem[];
    totalReviews: number;
    aiTastingNote?: 'string';
    aiSnacks?: ISnack[];
    isSaved?: boolean;
    myReview?: IWineReviewsListItem | null;
}
