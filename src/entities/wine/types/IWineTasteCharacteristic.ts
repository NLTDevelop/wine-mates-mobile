interface ILevel {
    id: number;
    name: string;
} 
export interface IWineTasteCharacteristic {
    id: number;
    name: string;
    description: string | null;
    levels: ILevel[];
    colorHex: string;
    isPremium: boolean;
    isTriple: boolean;
    selectedIndex?: number;
}


