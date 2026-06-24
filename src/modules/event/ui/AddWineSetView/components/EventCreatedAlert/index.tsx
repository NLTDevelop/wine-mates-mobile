import { useMemo } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { getStyles } from './styles';
import { useEventCreatedAlertQrCode } from './presenters/useEventCreatedAlertQrCode';
import { BottomModal } from '@/UIKit/BottomModal/ui';

interface IProps {
    visible: boolean;
    qrCodeValue: string | null;
    onClose: () => void;
    onCheckEventPress: () => void;
    onShareQrPress: (qrCodeImageUrl: string | null) => void;
}

export const EventCreatedAlert = ({
    visible,
    qrCodeValue,
    onClose,
    onCheckEventPress,
    onShareQrPress,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onPressShareQrCode, onQrCodeRef } = useEventCreatedAlertQrCode({ onShareQrPress });

    return (
        <BottomModal visible={visible} onClose={onClose} title={t('event.eventCreatedTitle')} titleVariant="subtitle_20_500">
            <View>
                <Typography
                    text={t('event.eventCreatedSubtitle')}
                    variant="body_400"
                    style={styles.subtitle}
                />

                {qrCodeValue && (
                    <View style={styles.qrCodeContainer}>
                        <QRCode
                            getRef={onQrCodeRef}
                            value={qrCodeValue}
                            size={160}
                            color={colors.text}
                            backgroundColor={colors.background}
                        />
                    </View>
                )}

                <Button
                    text={t('event.checkEvent')}
                    type="main"
                    onPress={onCheckEventPress}
                    containerStyle={styles.checkButton}
                />
                <Button
                    text={t('event.shareQrCode')}
                    type="secondary"
                    onPress={onPressShareQrCode}
                />
            </View>
        </BottomModal>
    );
};
