import { IMedia } from '@/entities/media/types/IMedia';
import { IWinery } from '@/entities/winery/types/IWinery';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';

export interface IPublicProfileUser {
    id: number;
    firstName: string;
    lastName: string;
    bio?: string | null;
    website: string | null;
    instagramLink: string | null;
    links?: string[];
    wineExperienceLevel: WineExperienceLevelEnum;
    rating: number | null;
    rankInCountry: number | null;
    rankInWorld: number | null;
    avatar: IMedia | null;
    gallery: IMedia[];
}

export interface IPublicProfile {
    user: IPublicProfileUser;
    winery: IWinery | null;
}
