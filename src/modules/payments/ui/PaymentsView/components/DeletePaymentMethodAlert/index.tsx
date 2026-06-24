import { useMemo } from 'react';
import { View } from 'react-native';
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export const DeletePaymentMethodAlert = ({ visible, onClose, onConfirm, isLoading }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <CustomAlert
            visible={visible}
            onClose={onClose}
            header={<Typography variant="h4" text={t('payments.deletePaymentMethodTitle')} style={styles.title} />}
            content={<Typography variant="body_400" text={t('payments.deletePaymentMethodMessage')} style={styles.message} />}
            footer={
                <View style={styles.buttonsContainer}>
                    <Button
                        text={t('common.yes')}
                        onPress={onConfirm}
                        type="main"
                        containerStyle={styles.button}
                        disabled={isLoading}
                    />
                    <Button
                        text={t('common.no')}
                        onPress={onClose}
                        type="secondary"
                        containerStyle={styles.button}
                        disabled={isLoading}
                    />
                </View>
            }
        />
    );
};
