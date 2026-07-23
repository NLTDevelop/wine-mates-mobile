import { IWineListItem } from '@/entities/wine/types/IWineListItem';

export interface IUserTastingListItem extends IWineListItem {
    myReview: NonNullable<IWineListItem['myReview']>;
}

export interface IUserTastingsList {
    count: number;
    rows: IUserTastingListItem[];
}
