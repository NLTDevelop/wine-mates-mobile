import { IMedia } from '@/entities/media/types/IMedia';

export interface IWineMarketplaceSummary {
    winery: {
        id: number;
        name: string;
        foundedYear: number | null;
        description: string | null;
        mainPhoto: IMedia | null;
        websiteUrl: string | null;
        minPrice?: number;
        currency: string;
    } | null;
    partners: Array<{
        id: number;
        name: string;
        websiteUrl: string | null;
        logo: IMedia | null;
        image: IMedia | null;
        minPrice?: number;
        currency: string;
    }>;
    users: {
        minPrice: number | null;
        maxPrice: number | null;
        currency: string;
    } | null;
}
