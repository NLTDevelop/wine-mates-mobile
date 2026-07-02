export interface IQuickFilterButtonItem {
    id: string;
    title: string;
    isSelected: boolean;
    isDisabled?: boolean;
    isMore?: boolean;
    onPress: () => void;
}
