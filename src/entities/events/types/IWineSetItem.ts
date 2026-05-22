import { IMedia } from "@/entities/media/types/IMedia";

export interface IWineInSet {
    id: number;
    name: string;
    producer?: string;
    vintage?: number;
    image?: IMedia;
    defaultImage?: IMedia 
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
