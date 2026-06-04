import Share, { ShareOptions } from 'react-native-share';

interface IShareWineParams {
    filename: string;
    imageUrl?: string | null;
    message: string;
    title: string;
}

interface IImageShareData {
    dataUrl: string;
    type: string;
}

const getImageShareData = async (imageUrl: string): Promise<IImageShareData> => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const imageType = blob.type.startsWith('image/') ? blob.type : 'image/jpeg';

    return new Promise<IImageShareData>((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = reject;
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                const [, base64Value = ''] = reader.result.split(',');

                resolve({
                    dataUrl: `data:${imageType};base64,${base64Value}`,
                    type: imageType,
                });
                return;
            }

            reject(new Error('Image data URL is unavailable'));
        };
        reader.readAsDataURL(blob);
    });
};

const getImageExtension = (imageType: string) => {
    if (imageType === 'image/png') {
        return 'png';
    }

    if (imageType === 'image/webp') {
        return 'webp';
    }

    return 'jpg';
};

const prepareShareOptions = async ({ filename, imageUrl, message, title }: IShareWineParams): Promise<ShareOptions> => {
    const shareOptions: ShareOptions = {
        failOnCancel: false,
        message,
        subject: title,
        title,
    };

    if (imageUrl) {
        const imageShareData = await getImageShareData(imageUrl);
        const imageExtension = getImageExtension(imageShareData.type);

        shareOptions.filename = `${filename}.${imageExtension}`;
        shareOptions.type = imageShareData.type;
        shareOptions.url = imageShareData.dataUrl;
        shareOptions.useInternalStorage = true;
    }

    return shareOptions;
};

export const shareWine = async (params: IShareWineParams) => {
    try {
        const shareOptions = await prepareShareOptions(params);

        return Share.open(shareOptions);
    } catch (error) {
        if (!params.imageUrl) {
            throw error;
        }

        const fallbackShareOptions = await prepareShareOptions({
            ...params,
            imageUrl: null,
        });

        return Share.open(fallbackShareOptions);
    }
};
