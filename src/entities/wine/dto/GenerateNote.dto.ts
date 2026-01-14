export interface GenerateNoteDto {
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
}

interface ITasteCharacteristic {
    characteristicId: number;
    levelId: number;
}
