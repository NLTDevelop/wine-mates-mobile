export interface IAIData {
    name: string | null;
    producer: string | null;
    vintage: number | null;
    grapeVariety: string | null;
    typeId: { id: number; isSparkling: boolean; name: string } | null;
    colorId: { id: number; name: string } | null;
    countryId: { id: number; colorHex: string; name: string } | null;
    regionId: { id: number; name: string } | null;
}
