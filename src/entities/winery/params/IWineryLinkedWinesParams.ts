export interface IWineryLinkedWinesParams {
    wineryId: number;
    limit: number;
    offset: number;
    search?: string;
    sort?: string | number;
    typeId?: string | number;
    colorId?: string | number;
}
