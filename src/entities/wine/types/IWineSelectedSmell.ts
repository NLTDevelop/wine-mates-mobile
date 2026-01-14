import { IAroma } from "./IWineSmell";

export interface IWineSelectedSmell {
    id: number;
    colorHex: string | null;
    name: string;
    subgroupId?: number | null;
    groupId?: number | null;
    aroma?: IAroma;
}