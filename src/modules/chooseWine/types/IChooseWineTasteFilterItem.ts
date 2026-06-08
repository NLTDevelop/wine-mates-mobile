export interface IChooseWineTasteFilterLabel {
    id: number;
    name: string;
    sortNumber: number;
}

export interface IChooseWineTasteFilterItem {
    id: number;
    title: string;
    description: string;
    colorHex: string;
    inactiveColor?: string;
    minSortNumber: number;
    maxSortNumber: number;
    minValue: number;
    maxValue: number;
    labels: IChooseWineTasteFilterLabel[];
    onChange: (minSortNumber: number, maxSortNumber: number) => void;
}
