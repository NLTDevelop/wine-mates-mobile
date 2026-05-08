import { useMemo } from 'react';
import { Modal, TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { CrossIcon } from '@assets/icons/CrossIcon';
// import { DoneIcon } from '@assets/icons/DoneIcon';
import { getStyles } from './styles';
import { useEventCreatedAlertQrCode } from './presenters/useEventCreatedAlertQrCode';

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
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback>
                        <View style={styles.card}>
                            <View style={styles.header}>
                                <Typography text={t('event.eventCreatedTitle')} variant="subtitle_20_500" style={styles.title} />
                                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                    <CrossIcon />
                                </TouchableOpacity>
                            </View>

                            <Typography
                                text={t('event.eventCreatedSubtitle')}
                                variant="body_400"
                                style={styles.subtitle}
                            />

                            {/* <View style={styles.iconContainer}>
                                <DoneIcon />
                            </View> */}
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
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
