export interface ISingleSelectModalItem {
    key: string;
    label: string;
    isSelected: boolean;
    onPress: () => void;
}
