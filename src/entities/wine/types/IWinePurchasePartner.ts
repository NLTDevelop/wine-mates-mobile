import { IMedia } from '@/entities/media/types/IMedia';
import { PartnerStatus } from '../enums/PartnerStatus';

export interface IWinePurchasePartner {
    id: number;
    name: string;
    description: string;
    website: string | null;
    status: PartnerStatus;
    logo: IMedia | null;
    image: IMedia;
    minPrice?: number;
    maxPrice?: number;
    currency?: string;
}
