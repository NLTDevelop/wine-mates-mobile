export interface IUniversalPickerOption {
    id: string;
    title: string;
    subtitle?: string;
    isSelected: boolean;
    onPress: () => void;
}
