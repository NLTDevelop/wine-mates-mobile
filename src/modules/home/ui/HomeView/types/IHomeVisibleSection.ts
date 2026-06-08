import { HomeSectionKey } from '@/entities/homeSections/types/HomeSectionKey';
import { IEvent } from '@/entities/events/types/IEvent';

export interface IHomePeopleTalking {
    authorName: string;
    authorAvatar: string | null;
    text: string;
    likesCount: number;
    commentsCount: number;
    hasLikes: boolean;
    hasComments: boolean;
    createdAtLabel: string;
}

export interface IHomeVisibleSection {
    key: HomeSectionKey;
    sortOrder: number;
    title: string;
    onRemovePress?: () => void;
    events?: IEvent[];
    peopleTalking?: IHomePeopleTalking[];
}
