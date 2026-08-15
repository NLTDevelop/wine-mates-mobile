export interface IWineEvolutionExpertAssessment {
    id: string;
    year: string;
    proScore: number | null;
    userScore: number | null;
    userScoreText: string;
}

export interface IWineEvolutionRating {
    score: number | null;
    reviews: number;
    scoreText: string;
    reviewsText: string;
    isActive: boolean;
    onPress: () => void;
}

export interface IWineEvolutionRatingRow {
    label: string;
    ratings: IWineEvolutionRating[];
}

export interface IWineEvolutionColorStat {
    label: string;
    reviews: number;
    reviewsText: string;
    backgroundColor: string;
    textColor: string;
}

export interface IWineEvolutionCarouselCard {
    id: string;
    year: string;
    colors: IWineEvolutionColorStat[];
    avatarUrls: string[];
    additionalPeople: number;
    additionalPeopleText: string;
    isEmpty?: boolean;
}

export interface IWineEvolutionLineSeries {
    id: string;
    color: string;
    path: string;
    markersPath: string;
    points: IWineEvolutionChartPoint[];
}

export interface IWineEvolutionChartPoint {
    index: number;
    x: number;
    y: number;
    value: number;
    valueText: string;
}

export interface IWineEvolutionXAxisLabel {
    id: string;
    text: string;
    style: {
        position: 'absolute';
        bottom: number;
        left: number;
        width: number;
    };
}

export interface IWineEvolutionAudienceControl {
    id: 'men' | 'women';
    title: string;
    isActive: boolean;
    onPress: () => void;
    ageControls: IWineEvolutionAgeControl[];
}

export interface IWineEvolutionAgeControl {
    id: string;
    title: string;
    color: string;
    backgroundColor: string;
    isActive: boolean;
    onPress: () => void;
}

export interface IWineEvolutionChart {
    id: string;
    title: string;
    yAxisLabels: string[];
    xAxisLabels: string[];
    gridY: number[];
    plotWidth: number;
    plotHeight: number;
    strokeWidth: number;
    series: IWineEvolutionLineSeries[];
    audienceControls?: IWineEvolutionAudienceControl[];
}
