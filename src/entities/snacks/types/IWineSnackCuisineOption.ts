export interface IWineSnackCuisineOption {
    id: number;
    name: string;
    isSelected: boolean;
    isDisabled: boolean;
    onPress: () => void;
}
