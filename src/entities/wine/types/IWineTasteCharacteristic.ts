interface ILevel {
    id: number;
    name: string;
} 
export interface IWineTasteCharacteristic {
    id: number;
    name: string;
    description: string;
    levels: ILevel[];
    colorHex: string;
    isPremium: boolean;
    selectedIndex?: number;
}


