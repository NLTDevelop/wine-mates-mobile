export interface IImportWineryWineDetail {
    row: number;
    name: string;
    producer: string;
    status: string;
}

export interface IImportWineryWinesResponse {
    success: boolean;
    importedCount: number;
    details: IImportWineryWineDetail[];
}
