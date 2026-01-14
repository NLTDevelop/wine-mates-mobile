import { IMedia } from '@/entities/media/types/IMedia';

export interface IWineListItem {
    id: number;
    name: string;
    vintage: number;
    producer: string;
    grapeVariety: string;
    userId: number;
    createdAt: string;
    image: IMedia;
    averageUserRating: number;
    totalReviews: number;
    lastReview: {
        review: string;
        createdAt: string;
        user: {
            firstName: string;
            lastName: string;
            avatar: {
                smallUrl: string;
                mediumUrl: string;
                originalUrl: string;
            } | null;
        };
    } | null;
}
