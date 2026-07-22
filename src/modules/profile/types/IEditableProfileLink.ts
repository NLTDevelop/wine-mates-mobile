export interface IEditableProfileLink {
    id: string;
    value: string;
    onChangeText: (value: string) => void;
    onDelete: () => void;
}
