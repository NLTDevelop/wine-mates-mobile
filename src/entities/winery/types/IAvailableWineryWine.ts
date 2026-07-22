import { IWineListItem } from '@/entities/wine/types/IWineListItem';

export interface IAvailableWineryWine extends IWineListItem {
    name: string;
}

export interface IAvailableWineryWineList {
    count: number;
    rows: IAvailableWineryWine[];
}
