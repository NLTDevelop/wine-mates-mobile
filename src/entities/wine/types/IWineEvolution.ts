export interface IWineEvolutionGroupRating {
    avg: number | null;
    count: number;
}

export interface IWineEvolutionRatingByGroup {
    men: {
        '18_25': IWineEvolutionGroupRating;
        '26_35': IWineEvolutionGroupRating;
        '36_45': IWineEvolutionGroupRating;
        '46_60': IWineEvolutionGroupRating;
        '60_plus': IWineEvolutionGroupRating;
    };
    women: {
        '18_25': IWineEvolutionGroupRating;
        '26_35': IWineEvolutionGroupRating;
        '36_45': IWineEvolutionGroupRating;
        '46_60': IWineEvolutionGroupRating;
        '60_plus': IWineEvolutionGroupRating;
    };
}

export interface IWineEvolutionStatistic {
    id: number;
    name: string;
    colorHex: string;
    userCount: number;
}

export interface IWineEvolutionTasteCharacteristicLevel {
    id: number;
    sortNumber: number;
    name: string;
}

export interface IWineEvolutionTasteCharacteristic {
    characteristicId: number;
    name: string;
    colorHex: string;
    avgSortNumber: number | null;
    avgLevelId: number | null;
    levelName: string | null;
    userCount: number;
    levels: IWineEvolutionTasteCharacteristicLevel[];
}

export interface IWineEvolutionWinePeak {
    year: number;
    userCount: number;
}

export interface IWineEvolutionVintage {
    wineId: number;
    vintage: number | null;
    reviewCount: number;
    avgUserRating: number | null;
    avgExpertRating: number | null;
    ratingByGroup: IWineEvolutionRatingByGroup;
    winePeaks: IWineEvolutionWinePeak[];
    topColors: IWineEvolutionStatistic[];
    topShades: IWineEvolutionStatistic[];
    topAromas: IWineEvolutionStatistic[];
    topFlavors: IWineEvolutionStatistic[];
    tasteCharacteristics: IWineEvolutionTasteCharacteristic[];
}
