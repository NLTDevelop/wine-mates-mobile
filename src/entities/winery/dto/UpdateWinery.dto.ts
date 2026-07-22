export interface UpdateWineryDto {
    name?: string;
    foundedYear?: number;
    description?: string;
    countryId?: number;
    regionId?: number | null;
    links?: string[];
    removeMainPhoto?: boolean;
    removeGalleryFileIds?: number[];
}
