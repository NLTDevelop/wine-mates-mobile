import { IMedia } from '@/entities/media/types/IMedia';

export interface IWineListItem {
    id: number;
    name: string | null;
    vintage: number | null;
    producer?: string;
    grapeVariety?: string;
    userId?: number;
    createdAt: string;
    image: IMedia | null;
    averageUserRating: number;
    countUserRating: number | null;
    averageExpertRating: number | null;
    countExpertRating: number | null;
    similarity?: number;
    totalReviews?: number;
    country?: {
        id: number;
        name: string;
    };
    region?: {
        id: number;
        name: string;
    } | null;
    lastReview?: {
        review: string;
        createdAt: string;
        user: {
            id?: number;
            firstName: string;
            lastName: string;
            image: IMedia | null;
        };
    } | null;
    lastRate?: {
        id: number;
        review: string;
        createdAt: string;
        user: {
            id: number;
            firstName: string;
            lastName: string;
            image: IMedia | null;
        };
    } | null;
}
