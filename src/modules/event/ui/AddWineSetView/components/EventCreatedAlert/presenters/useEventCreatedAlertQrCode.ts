import { useCallback, useRef } from 'react';

const QR_CODE_IMAGE_PREFIX = 'data:image/png;base64,';

type QrCodeRef = {
    toDataURL: (callback: (data: string) => void) => void;
};

interface IProps {
    onShareQrPress: (qrCodeImageUrl: string | null) => void;
}

export const useEventCreatedAlertQrCode = ({ onShareQrPress }: IProps) => {
    const qrCodeRef = useRef<QrCodeRef | null>(null);

    const onQrCodeRef = useCallback((ref: QrCodeRef | null) => {
        qrCodeRef.current = ref;
    }, []);

    const onPressShareQrCode = useCallback(() => {
        qrCodeRef.current?.toDataURL((data) => {
            onShareQrPress(`${QR_CODE_IMAGE_PREFIX}${data}`);
        });

        if (!qrCodeRef.current) {
            onShareQrPress(null);
        }
    }, [onShareQrPress]);

    return {
        onPressShareQrCode,
        onQrCodeRef,
    };
};
