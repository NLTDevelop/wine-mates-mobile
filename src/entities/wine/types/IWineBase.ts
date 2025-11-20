export interface IWineBaseValue {
    id: number | null;
    value: string;
    isSparkling?: boolean;
}

export interface IWineBase {
    typeOfWine: IWineBaseValue;
    colorOfWine: IWineBaseValue;
    country: IWineBaseValue;
    region: IWineBaseValue;
    winery: IWineBaseValue;
    grapeVariety: IWineBaseValue;
    vintageYear: IWineBaseValue;
    wineName: IWineBaseValue;
}
