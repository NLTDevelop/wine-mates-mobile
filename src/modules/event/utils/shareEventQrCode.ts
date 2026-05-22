import Share, { ShareOptions } from 'react-native-share';

interface IShareEventQrCodeParams {
    filename: string;
    message: string;
    qrCodeImageUrl: string;
    title: string;
}

const prepareShareOptions = ({
    filename,
    message,
    qrCodeImageUrl,
    title,
}: IShareEventQrCodeParams): ShareOptions => {
    return {
        failOnCancel: false,
        filename,
        message,
        subject: title,
        title,
        type: 'image/png',
        url: qrCodeImageUrl,
        useInternalStorage: true,
    };
};

export const shareEventQrCode = (params: IShareEventQrCodeParams) => {
    const shareOptions = prepareShareOptions(params);

    return Share.open(shareOptions);
};
