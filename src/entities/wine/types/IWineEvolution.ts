import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';

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
    colorHex: string | null;
    userCount: number;
    pale?: IWineEvolutionColorShade | null;
    medium?: IWineEvolutionColorShade | null;
    deep?: IWineEvolutionColorShade | null;
}

export interface IWineEvolutionColorShade {
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
    colorHex: string | null;
    levels: IWineEvolutionTasteCharacteristicLevel[];
    allYears?: IWineEvolutionTasteCharacteristicValue | null;
    byYear?: IWineEvolutionTasteCharacteristicValue[];
    avgSortNumber?: number | null;
    avgLevelId?: number | null;
    levelName?: string | null;
    userCount?: number;
}

export interface IWineEvolutionTasteCharacteristicValue {
    year?: number;
    avgSortNumber: number | null;
    avgLevelId: number | null;
    levelName: string | null;
    userCount: number;
}

export interface IWineEvolutionWinePeakDistribution {
    year: number;
    userCount: number;
}

export interface IWineEvolutionWinePeak {
    from: number | null;
    to: number | null;
    distribution: IWineEvolutionWinePeakDistribution[];
}

export interface IWineEvolutionReviewer {
    id: number;
    firstName: string;
    lastName: string;
    wineExperienceLevel: WineExperienceLevelEnum;
    avatar: {
        smallUrl: string;
        mediumUrl: string;
        originalUrl: string;
    } | null;
}

export interface IWineEvolutionReviewers {
    totalCount: number;
    users?: IWineEvolutionReviewer[];
}

export interface IWineEvolutionYear {
    year: number;
    reviewCount: number;
    avgUserRating: number | null;
    avgExpertRating: number | null;
    ratingByGroup: IWineEvolutionRatingByGroup;
    ratingByGroupWithExperts?: IWineEvolutionRatingByGroup;
    winePeak?: IWineEvolutionWinePeak | null;
    topColors?: IWineEvolutionStatistic[];
    topAromas?: IWineEvolutionStatistic[];
    topFlavors?: IWineEvolutionStatistic[];
    reviewers?: IWineEvolutionReviewers | null;
}

export interface IWineEvolutionAggregate extends Omit<IWineEvolutionYear, 'year'> {
    reviewers: IWineEvolutionReviewers | null;
    topColors?: IWineEvolutionStatistic[];
    topAromas?: IWineEvolutionStatistic[];
    topFlavors?: IWineEvolutionStatistic[];
}

export interface IWineEvolutionYearValue<T> {
    year: number;
    items: T[];
}

export interface IWineEvolutionByYear<TAllYears, TByYear> {
    allYears: TAllYears;
    byYear: TByYear[];
}

export interface IWineEvolutionResponse {
    wineId: number;
    vintage: number | null;
    currentYear: number;
    years: number[];
    yearOptions: Array<'all' | number>;
    ratings: IWineEvolutionByYear<Omit<IWineEvolutionYear, 'year'>, IWineEvolutionYear>;
    winePeak: IWineEvolutionByYear<IWineEvolutionWinePeak | null, IWineEvolutionWinePeak & { year: number }>;
    reviewers: IWineEvolutionByYear<IWineEvolutionReviewers | null, IWineEvolutionReviewers & { year: number }>;
    topColors: IWineEvolutionByYear<IWineEvolutionStatistic[], IWineEvolutionYearValue<IWineEvolutionStatistic>>;
    topAromas: IWineEvolutionByYear<IWineEvolutionStatistic[], IWineEvolutionYearValue<IWineEvolutionStatistic>>;
    topFlavors: IWineEvolutionByYear<IWineEvolutionStatistic[], IWineEvolutionYearValue<IWineEvolutionStatistic>>;
    tasteCharacteristics: IWineEvolutionTasteCharacteristic[];
}
