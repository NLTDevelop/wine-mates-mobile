import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';

export interface IWineSetViewItem {
    id: number;
    title: string;
    subtitle: string;
    imageUrl: string;
    onEditPress: () => void;
    onDeletePress: () => void;
}

export interface IWineSearchResultViewItem extends IWineSetSearchItem {
    title: string;
    subtitle: string;
    onPress: () => void;
}
