export interface IAIData {
    name: string | null;
    producer: string | null;
    vintage: number | null;
    grapeVariety: string | null;
    wineType: { id: number; isSparkling: boolean; name: string } | null;
    wineColor: { id: number; colorHex: string; name: string } | null;
    country: { id: number; name: string } | null;
    region: { id: number; name: string } | null;
}
