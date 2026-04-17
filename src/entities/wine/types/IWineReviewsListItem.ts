export interface IWineReviewsListItem {
    id: number;
    userRating: number | null;
    expertRating: number | null;
    review: string | null;
    createdAt: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        wineExperienceLevel: string;
        avatar?: {
            smallUrl: string;
            mediumUrl: string;
            originalUrl: string;
        } | null;
        image?: {
            smallUrl: string;
            mediumUrl: string;
            originalUrl: string;
        } | null;
    };
}
