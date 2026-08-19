export type WineColorTone = 'pale' | 'medium' | 'deep';

export interface IColorStatistic {
    id: number;
    name: string;
    tone: WineColorTone;
    colorHex: string;
    userCount: number;
}
