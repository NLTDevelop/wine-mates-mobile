import { IWineTasteCharacteristic } from './IWineTasteCharacteristic';

interface IRateMedia {
    smallUrl: string;
    mediumUrl: string;
    originalUrl: string;
}

interface IRateStatistic {
    id: number;
    colorHex: string;
    name: string;
}

export interface IRateDetails {
    id: number;
    wineId: number;
    eventId: number | null;
    userRating: number | null;
    expertRating: number | null;
    review: string | null;
    winePeak: number | null;
    createdAt: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        wineExperienceLevel: string;
        image: IRateMedia | null;
    };
    color: (IRateStatistic & {
        tone: 'pale' | 'medium' | 'deep' | null;
        mousse: unknown | null;
        perlage: unknown | null;
        appearance: unknown | null;
    }) | null;
    aromas: IRateStatistic[];
    flavors: IRateStatistic[];
    tasteCharacteristics: IWineTasteCharacteristic[];
}
