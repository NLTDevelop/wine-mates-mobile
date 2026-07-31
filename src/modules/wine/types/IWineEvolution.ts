export interface IWineEvolutionExpertAssessment {
    id: string;
    year: string;
    score: number | null;
}

export interface IWineEvolutionRating {
    score: number | null;
    reviews: number;
    scoreText: string;
    reviewsText: string;
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
    avatarSources: number[];
    additionalPeople: number;
    additionalPeopleText: string;
    isEmpty?: boolean;
}

export interface IWineEvolutionLineSeries {
    id: string;
    color: string;
    points: string;
    lastPoint: {
        x: number;
        y: number;
    };
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
}
