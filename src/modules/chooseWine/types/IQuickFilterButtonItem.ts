export interface IQuickFilterButtonItem {
    id: string;
    title: string;
    wineCountText?: string;
    isSelected: boolean;
    isDisabled?: boolean;
    isMore?: boolean;
    onPress: () => void;
}
