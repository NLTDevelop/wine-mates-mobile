export interface IAroma {
    id: number;
    name: string;
    colorHex: string;
    sortNumber: number;
}

export interface ISmellSubgroup {
    id: number;
    name: string;
    colorHex: string;
    sortNumber: number;
    aromas: IAroma[];
}

export interface IWineSmell {
    id: number;
    name: string;
    colorHex: string;
    sortNumber: number;
    subgroups: ISmellSubgroup[];
}
