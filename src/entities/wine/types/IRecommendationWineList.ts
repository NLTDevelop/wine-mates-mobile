export interface IRecommendationWineColor {
    id: number;
    colorHex: string;
    name: string;
}

export interface IRecommendationWineType {
    id: number;
    isSparkling: boolean;
    name: string;
}

export interface IRecommendationWineCountry {
    id: number;
    name: string;
}

export interface IRecommendationWineRegion {
    id: number;
    name: string;
}

export interface IRecommendationWineImage {
    name: string;
    originalName: string;
    mimetype: string;
    size: number;
    smallUrl: string;
    mediumUrl: string;
    originalUrl: string;
}

export interface IRecommendationWineItem {
    id: number;
    name: string;
    vintage: number;
    producer: string;
    grapeVariety: string;
    averageUserRating: number;
    countUserRating: number;
    image: IRecommendationWineImage;
    color: IRecommendationWineColor;
    type: IRecommendationWineType;
    country: IRecommendationWineCountry;
    region: IRecommendationWineRegion;
}

export interface IRecommendationWineList {
    count: number;
    totalPages: number;
    rows: IRecommendationWineItem[];
}
