export interface IAroma {
    id: number;
    nameUa: string;
    nameEn: string;
    name: string;
    colorHex: string;
    sortNumber: number;
}

export interface ISmellSubgroup {
    id: number;
    nameUa: string;
    nameEn: string;
    name: string;
    colorHex: string;
    sortNumber: number;
    aromas: IAroma[];
}

export interface IWineSmell {
    id: number;
    nameUa: string;
    nameEn: string;
    name: string;
    colorHex: string;
    sortNumber: number;
    subgroups: ISmellSubgroup[];
}
