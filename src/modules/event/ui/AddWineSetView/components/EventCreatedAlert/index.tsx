import { useMemo } from 'react';
import { Modal, TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { DoneIcon } from '@assets/icons/DoneIcon';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    onClose: () => void;
    onCheckEventPress: () => void;
    onShareQrPress: () => void;
}

export const EventCreatedAlert = ({
    visible,
    onClose,
    onCheckEventPress,
    onShareQrPress,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

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

                            <View style={styles.iconContainer}>
                                <DoneIcon />
                            </View>

                            <Button
                                text={t('event.checkEvent')}
                                type="main"
                                onPress={onCheckEventPress}
                                containerStyle={styles.checkButton}
                            />
                            <Button
                                text={t('event.shareQrCode')}
                                type="secondary"
                                onPress={onShareQrPress}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
