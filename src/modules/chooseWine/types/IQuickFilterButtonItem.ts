export interface IQuickFilterButtonItem {
    id: string;
    title: string;
    isSelected: boolean;
    isMore?: boolean;
    onPress: () => void;
}
