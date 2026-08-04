import { WineOfferVintages } from '@/entities/wine/types/WineOfferVintages';

export interface IPartnerWineOffersParams {
    wineId?: number;
    vintages?: WineOfferVintages;
    minPrice?: number;
    maxPrice?: number;
    offset?: number;
    limit?: number;
    partnerId?: number;
}
