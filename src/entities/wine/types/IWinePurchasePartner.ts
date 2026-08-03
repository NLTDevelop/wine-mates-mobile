import { IMedia } from '@/entities/media/types/IMedia';
import { PartnerStatus } from '../enums/PartnerStatus';

export interface IWinePurchasePartner {
    id: number;
    name: string;
    description: string;
    websiteUrl: string | null;
    status: PartnerStatus;
    logo: IMedia | null;
    image: IMedia | null;
    minPrice?: number;
    maxPrice?: number;
    currency?: string;
}
