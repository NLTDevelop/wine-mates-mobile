import type { IWineImage } from '../types/IWineImage';

interface ITasteCharacteristic {
    characteristicId: number;
    levelId: number;
}

export interface AddRateDto {
    wineId: number;
    userRating?: number;
    expertRating?: number;
    review: string;
    color: {
        colorId: number;
        shadeId: number;
        tone: string;
        mousse?: number;
        perlage?: number;
        appearance?: number;
    };
    aromas: number[];
    flavors: number[];
    tasteCharacteristics: ITasteCharacteristic[];
    suggestions?: {
        aromas?: string[];
        flavors?: string[];
    };
    image?: IWineImage;
    winePeak?: number;
}
