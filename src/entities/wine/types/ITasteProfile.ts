export interface ITasteProfileColorShade {
    colorHex: string;
    count: number;
}

export interface ITasteProfileStatisticItem {
    id: number;
    name: string;
    colorHex: string;
    count: number;
    pale?: ITasteProfileColorShade;
    medium?: ITasteProfileColorShade;
    deep?: ITasteProfileColorShade;
}

export interface ITasteProfileCharacteristicLevel {
    id: number;
    name: string;
}

export interface ITasteProfileCharacteristic {
    id: number;
    name: string;
    description: string;
    colorHex: string;
    isPremium: boolean;
    qtyLevels: number;
    avgValue: number | null;
    levels: ITasteProfileCharacteristicLevel[];
}

export interface ITasteProfileTopWinePeak {
    year: number;
    userCount: number;
}

export interface ITasteProfileStatistics {
    colors: ITasteProfileStatisticItem[];
    aromas: ITasteProfileStatisticItem[];
    flavors: ITasteProfileStatisticItem[];
    tasteCharacteristics: ITasteProfileCharacteristic[];
    topWinePeaks: ITasteProfileTopWinePeak[];
}

export interface ITasteProfileType {
    id: number;
    isSparkling: boolean;
    name: string;
}

export interface ITasteProfileColor {
    id: number;
    colorHex: string;
    name: string;
}

export interface ITasteProfile {
    type: ITasteProfileType;
    color: ITasteProfileColor;
    statistics: ITasteProfileStatistics;
}
