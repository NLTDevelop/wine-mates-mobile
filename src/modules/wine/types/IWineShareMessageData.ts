export interface IWineShareMessageData {
    intro: string;
    labels: IWineShareMessageLabels;
    title: string;
    producer?: string | null;
    grapeVariety?: string | null;
    country?: string | null;
    region?: string | null;
    type?: string | null;
    link: string;
}

export interface IWineShareMessageLabels {
    title: string;
    producer: string;
    grapeVariety: string;
    country: string;
    region: string;
    type: string;
}
