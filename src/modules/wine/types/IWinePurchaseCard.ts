import { PartnerStatus } from '@/entities/wine/enums/PartnerStatus';

export interface IWinePurchaseCard {
    id: number;
    name: string;
    titlePrefix: string;
    titleHighlight: string;
    imageUrl: string | null;
    logoUrl: string | null;
    priceText: string | null;
    hasPriceRange: boolean;
    status: PartnerStatus;
    onPress: () => void;
}
