export interface IEditableWineryLink {
    id: string;
    value: string;
    onChangeText: (value: string) => void;
    onDelete: () => void;
}
