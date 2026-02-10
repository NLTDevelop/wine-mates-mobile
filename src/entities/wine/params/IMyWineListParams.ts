import { WineListScope } from '../types/IWineListScope';

export interface IMyWineListParams {
    limit: number;
    offset: number;
    search: string;
    scope: WineListScope;
    sort?: string | number;
    typeId?: string | number;
    colorId?: string | number;
}