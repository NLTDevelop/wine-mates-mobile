export interface IEventShareMessageData {
    intro: string;
    labels: IEventShareMessageLabels;
    title: string;
    dateTime?: string | null;
    meetingPlaceName?: string | null;
    location?: string | null;
    mapLink?: string | null;
    price?: string | null;
    eventType?: string | null;
    tastingType?: string | null;
    link: string;
}

export interface IEventShareMessageLabels {
    title: string;
    dateTime: string;
    meetingPlaceName: string;
    location: string;
    mapLink: string;
    price: string;
    eventType: string;
    tastingType: string;
}
