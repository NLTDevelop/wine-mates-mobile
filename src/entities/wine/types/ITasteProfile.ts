export interface ITasteProfileStatisticItem {
    id: number;
    name: string;
    colorHex: string;
    count: number;
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

export interface ITasteProfileStatistics {
    colors: ITasteProfileStatisticItem[];
    aromas: ITasteProfileStatisticItem[];
    flavors: ITasteProfileStatisticItem[];
    tasteCharacteristics: ITasteProfileCharacteristic[];
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
