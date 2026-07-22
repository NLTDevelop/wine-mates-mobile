export interface IEditableRegistrationLink {
    id: string;
    value: string;
    onChangeText: (value: string) => void;
    onDelete: () => void;
}
