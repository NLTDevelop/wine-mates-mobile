export interface CreateWineOfferDto {
    wineId: number;
    price: number;
    currency: string;
    quantity?: number;
    websiteUrl?: string;
}
