import { PartnerStatus } from '@/entities/wine/enums/PartnerStatus';

export interface IWinePurchaseCard {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    logoUrl: string | null;
    priceText: string | null;
    hasPriceRange: boolean;
    status: PartnerStatus;
    onPress: () => void;
}
