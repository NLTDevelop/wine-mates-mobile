import { HomeSectionKey } from './HomeSectionKey';
import { IAvatar } from '@/entities/users/types/IUser';
import { IMedia } from '@/entities/media/types/IMedia';

export interface IHomeSectionEventData {
    id: number;
    theme: string;
    restaurantName?: string | null;
    locationLabel?: string | null;
    eventStartDate?: string | null;
    eventStartTime?: string | null;
    eventEndDate?: string | null;
    eventEndTime?: string | null;
    price?: number | null;
    priceUsd?: number | null;
    currency?: string | null;
    description?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    language?: string | null;
    seats?: {
        total: number;
        left: number;
    } | null;
    isActive?: boolean;
    eventType?: string | null;
    tastingType?: string | null;
    ownerId?: number;
    isSaved?: boolean;
    participants?: any[];
    acceptedCount?: number;
    distanceKm?: string | number | null;
    status?: string | null;
}

export interface IHomeSectionPeopleTalkingAuthor {
    id: number;
    firstName: string;
    lastName: string;
    avatar: IAvatar | null;
}

export interface IHomeSectionPeopleTalkingData {
    id: number;
    author: IHomeSectionPeopleTalkingAuthor;
    media?: IMedia[];
    text: string | null;
    likesCount: number | null;
    commentsCount: number | null;
    createdAt: string | null;
}

export type HomeSectionData = IHomeSectionEventData[] | IHomeSectionPeopleTalkingData[] | null;

export interface IHomeSection {
    key: HomeSectionKey;
    sortOrder: number;
    isVisible: boolean;
    data?: HomeSectionData;
}
