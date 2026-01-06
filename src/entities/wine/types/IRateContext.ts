import { ISnack } from "@/entities/snacks/types/ISnack";

export interface IRateContext {
    aiUsage: { total: number, left: number },
    snacks: ISnack[] | null,
    note: string | null,
}