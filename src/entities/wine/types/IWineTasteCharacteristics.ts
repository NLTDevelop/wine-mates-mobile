export interface IWineTasteCharacteristics {
    id: number;
    name: string;
    description: string;
    levels: string[];
    colorHex: string;
    isPremium: boolean;
    selectedLevel?: number;
}
