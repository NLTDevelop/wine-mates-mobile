import { IWineTaste } from "./IWineTaste";

export interface IWineTasteGroup {
    colorHex: string;
    id: number;
    name: string;
    sortNumber: number;
    flavors: IWineTaste[];
}
