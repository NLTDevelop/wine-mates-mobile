import { useEventQrCodeShare } from '@/modules/event/presenters/useEventQrCodeShare';

interface IProps {
    onShareQrPress: (qrCodeImageUrl: string | null) => void;
}

export const useEventCreatedAlertQrCode = ({ onShareQrPress }: IProps) => {
    const { onQrCodeRef, onShareQrCodePress } = useEventQrCodeShare({ onShareQrPress });

    return {
        onPressShareQrCode: onShareQrCodePress,
        onQrCodeRef,
    };
};
