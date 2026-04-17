export interface IWineFilterOption {
    label: string;
    value: number | string;
}

export interface IWineFilters {
    sort: IWineFilterOption[];
    colors: IWineFilterOption[];
    types: IWineFilterOption[];
}
