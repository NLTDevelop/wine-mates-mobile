export interface IPaymentsListItem {
    id: number;
    name: string;
    paymentDetails: string;
    description: string;
    isVisible: boolean;
    qrCode: {
        id: number;
        name: string;
        originalName: string;
        mimetype: string;
        size: number;
        smallUrl: string;
        mediumUrl: string;
        originalUrl: string;
    } | null;
}
