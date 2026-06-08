export interface IEventPaymentMethodOption {
    id: number;
    name: string;
    paymentDetails: string;
    isSelected: boolean;
    onPress: () => void;
}
