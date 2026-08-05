export interface IPrivateOfferListItem {
    id: number;
    fullName: string;
    avatarUrl: string | null;
    priceText: string;
    onPress: () => void;
}
