import { Platform } from 'react-native';
import Share, { ShareOptions } from 'react-native-share';

interface IShareEventQrCodeParams {
    filename: string;
    message: string;
    qrCodeImageUrl: string;
    title: string;
}

const prepareActivityItem = (type: 'text' | 'url', content: string) => {
    return {
        type,
        content,
    };
};

const prepareIosShareOptions = ({ message, qrCodeImageUrl, title }: IShareEventQrCodeParams): ShareOptions => {
    const qrCodeImageSource = {
        placeholderItem: prepareActivityItem('url', qrCodeImageUrl),
        item: {
            default: prepareActivityItem('url', qrCodeImageUrl),
        },
        subject: {
            default: title,
        },
        dataTypeIdentifier: {
            default: 'wine-mates-event.png',
        },
        thumbnailImage: {
            default: qrCodeImageUrl,
        },
        linkMetadata: {
            title,
            base64Icon: qrCodeImageUrl,
        },
    };

    const messageSource = {
        placeholderItem: prepareActivityItem('text', message),
        item: {
            default: prepareActivityItem('text', message),
        },
        subject: {
            default: title,
        },
        linkMetadata: {
            title: message,
        },
    };

    return {
        activityItemSources: [qrCodeImageSource, messageSource],
        failOnCancel: false,
        subject: title,
        title,
    };
};

const prepareDefaultShareOptions = ({
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
    const shareOptions = Platform.OS === 'ios' ? prepareIosShareOptions(params) : prepareDefaultShareOptions(params);

    return Share.open(shareOptions);
};
