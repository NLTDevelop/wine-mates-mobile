import { IWineListItem } from "./IWineListItem";

export interface ISavedWinesListItem {
    id: number;
    listName: string;
    wines: IWineListItem[]; 
}