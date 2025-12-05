export interface IWineBaseValue {
    id: number | null;
    value: string | null;
    isSparkling?: boolean;
}

export interface IWineBase {
    typeOfWine: IWineBaseValue;
    colorOfWine: IWineBaseValue;
    country: IWineBaseValue;
    region: IWineBaseValue;
    producer: IWineBaseValue;
    grapeVariety: IWineBaseValue;
    vintageYear: IWineBaseValue;
    wineName: IWineBaseValue;
}
