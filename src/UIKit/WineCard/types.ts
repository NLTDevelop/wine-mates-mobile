export interface ICarouselWineCardImage {
    name: string;
    originalName: string;
    mimetype: string;
    size: number;
    smallUrl: string;
    mediumUrl: string;
    originalUrl: string;
}

export interface ICarouselWineCardUser {
    firstName: string;
    lastName: string;
    image?: {
        originalUrl: string;
    } | null;
}

export interface ICarouselWineCardLastReview {
    user: ICarouselWineCardUser;
    review: string | null;
    createdAt?: string;
}

export interface ICarouselWineCardType {
    id: number;
    isSparkling: boolean;
    name: string;
}

export interface ICarouselWineCardData {
    id: number;
    name: string;
    vintage: number;
    producer: string;
    averageUserRating: number;
    countUserRating: number;
    totalReviews?: number;
    averageExpertRating?: number;
    image: ICarouselWineCardImage;
    type: ICarouselWineCardType;
    lastReview?: ICarouselWineCardLastReview | null;
}
