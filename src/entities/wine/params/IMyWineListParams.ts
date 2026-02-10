import { WineListScope } from '../types/IWineListScope';

export interface IMyWineListParams {
    limit: number;
    offset: number;
    search: string;
    scope: WineListScope;
}