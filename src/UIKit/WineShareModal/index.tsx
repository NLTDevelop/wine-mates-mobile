import { useMemo } from 'react';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    onClose: () => void;
    onShareMessengerPress: () => void;
    onCopyLinkPress: () => void;
}

export const WineShareModal = ({
    visible,
    onClose,
    onShareMessengerPress,
    onCopyLinkPress,
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
            <View style={styles.modalContainer}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                <View style={styles.card}>
                    <View style={styles.header}>
                        <View style={styles.closeButton} />
                        <Typography variant="h4" text={t('wine.shareWineTitle')} style={styles.title} />
                        <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={8}>
                            <CrossIcon color={colors.text_light} />
                        </TouchableOpacity>
                    </View>
                    <Typography
                        variant="h6"
                        text={t('wine.shareWineDescription')}
                        style={styles.description}
                    />
                    <Button
                        text={t('wine.shareWineMessenger')}
                        onPress={onShareMessengerPress}
                        type="main"
                        containerStyle={styles.actionButton}
                    />
                    <Button
                        text={t('wine.shareWineCopyLink')}
                        onPress={onCopyLinkPress}
                        type="secondary"
                        containerStyle={styles.copyButton}
                        textStyle={styles.copyButtonText}
                    />
                </View>
            </View>
        </Modal>
    );
};
