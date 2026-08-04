import { WineOfferVintages } from '@/entities/wine/types/WineOfferVintages';

export interface IWineMarketplaceParams {
    wineId: number;
    vintages?: WineOfferVintages;
}
