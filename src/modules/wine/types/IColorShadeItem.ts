export interface IColorShadeStatistic {
    colorHex: string;
    userCount: number;
}

export interface IColorStatisticWithShades {
    id: number;
    name: string;
    pale?: IColorShadeStatistic | null;
    medium?: IColorShadeStatistic | null;
    deep?: IColorShadeStatistic | null;
}

export interface IColorShadeItem {
    id: string;
    colorHex: string;
    label: string;
    reviews: number;
    count: string;
}
