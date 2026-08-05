import { ISnack } from '@/entities/snacks/types/ISnack';

export interface IAIUsage {
    total: number;
    left: number;
}

export interface IRateContext {
    aiUsage: IAIUsage;
    snacks: ISnack[] | null;
    note: string | null;
}
