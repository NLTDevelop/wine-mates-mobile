import { PublicProfileTab } from '@/modules/profile/enums/PublicProfileTab';
import { WineOfferVintages } from '@/entities/wine/types/WineOfferVintages';

export interface IPublicProfileRouteParams {
    userId: number;
    initialTab?: PublicProfileTab;
    wineId?: number;
    vintages?: WineOfferVintages;
}
