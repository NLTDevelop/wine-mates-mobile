export interface UpdateWineOfferDto {
    price: number;
    currency: string;
    quantity?: number;
    websiteUrl: string | null;
}
