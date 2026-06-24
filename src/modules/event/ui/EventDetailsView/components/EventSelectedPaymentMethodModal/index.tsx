import { useMemo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { IEventPaymentMethod } from '@/modules/event/ui/EventDetailsView/types/IEventPaymentMethod';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    paymentMethod: IEventPaymentMethod | null;
    onClose: () => void;
}

export const EventSelectedPaymentMethodModal = ({ visible, paymentMethod, onClose }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const paymentDescription = paymentMethod?.qrCodeOriginalUrl
        ? t('payments.selectedPaymentMethodQrDescription')
        : t('payments.selectedPaymentMethodIbanDescription', { name: paymentMethod?.name || 'IBAN' });

    return (
        <CustomAlert
            visible={visible}
            onClose={onClose}
            header={
                <View style={styles.header}>
                    <View style={styles.headerSide} />
                    <Typography text={t('payments.paymentMethod')} variant="h4" style={styles.headerTitle} />
                    <TouchableOpacity onPress={onClose} style={styles.headerSide} hitSlop={8}>
                        <CrossIcon width={20} height={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
            }
            content={
                <View style={styles.contentContainer}>
                    {paymentMethod?.qrCodeOriginalUrl ? (
                        <Image source={{ uri: paymentMethod.qrCodeOriginalUrl }} style={styles.qrImage} resizeMode="contain" />
                    ) : (
                        <Typography text={paymentMethod?.paymentDetails || ''} variant="h5" style={styles.paymentDetails} />
                    )}
                    <Typography text={paymentDescription} variant="body_400" style={styles.description} />
                </View>
            }
            footer={
                <View style={styles.footerContainer}>
                    <Button text={t('common.close')} onPress={onClose} type="main" containerStyle={styles.closeButton} />
                </View>
            }
        />
    );
};
