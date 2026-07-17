export interface IWineryRegistration {
    name: string;
    foundedYear: number;
    description: string;
    countryId: number;
    regionId: number | null;
    links: string[];
}
