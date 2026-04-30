export interface IPaymentMethodOption {
    id: number;
    name: string;
    isSelected: boolean;
    onPress: () => void;
}
