import { IPublicProfile } from '@/entities/users/types/IPublicProfile';
import { PublicProfileTab } from '@/modules/profile/enums/PublicProfileTab';
import { WineOfferVintages } from '@/entities/wine/types/WineOfferVintages';

export interface IPublicProfileRouteParams {
    userId: number;
    initialProfile?: IPublicProfile;
    initialTab?: PublicProfileTab;
    wineId?: number;
    vintages?: WineOfferVintages;
}
