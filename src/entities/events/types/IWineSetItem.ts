export interface IWineImage {
    smallUrl?: string;
    mediumUrl?: string;
    originalUrl?: string;
}

export interface IWineInSet {
    id: number;
    name: string;
    producer?: string;
    vintage?: number;
    image?: IWineImage;
}

export interface IWineSetItem {
    id: number;
    wineId: number;
    sortOrder: number;
    wine: IWineInSet;
}
