import { useCallback, useRef } from 'react';

const QR_CODE_IMAGE_PREFIX = 'data:image/png;base64,';

type QrCodeRef = {
    toDataURL: (callback: (data: string) => void) => void;
};

interface IProps {
    onShareQrPress: (qrCodeImageUrl: string | null) => void;
}

export const useEventQrCodeShare = ({ onShareQrPress }: IProps) => {
    const qrCodeRef = useRef<QrCodeRef | null>(null);

    const onQrCodeSharePress = useCallback(
        (qrCodeData?: string) => {
            if (!qrCodeData) {
                onShareQrPress(null);
                return;
            }

            onShareQrPress(`${QR_CODE_IMAGE_PREFIX}${qrCodeData}`);
        },
        [onShareQrPress],
    );

    const onQrCodeRef = useCallback((ref: QrCodeRef | null) => {
        qrCodeRef.current = ref;
    }, []);

    const onShareQrCodePress = useCallback(() => {
        qrCodeRef.current?.toDataURL(onQrCodeSharePress);

        if (!qrCodeRef.current) {
            onQrCodeSharePress();
        }
    }, [onQrCodeSharePress]);

    return {
        onQrCodeRef,
        onShareQrCodePress,
    };
};
