import { ReactNode, useMemo } from 'react';
import { View, Modal, TouchableWithoutFeedback, Animated } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { useCustomAlert } from '../presenters/useCustomAlert';

interface IProps {
    visible: boolean;
    onClose: () => void;
    header?: ReactNode;
    content?: ReactNode;
    footer?: ReactNode;
}

export const CustomAlert = ({ visible, onClose, header, content, footer }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isVisible, backdropOpacity, scaleAnim, handleClose } = useCustomAlert({ visible, onClose });

    if (!isVisible) {
        return null;
    }

    return (
        <Modal visible={isVisible} transparent animationType="none" statusBarTranslucent onRequestClose={handleClose}>
            <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={handleClose}>
                    <Animated.View
                        style={[
                            styles.backdrop,
                            {
                                opacity: backdropOpacity.current,
                            },
                        ]}
                    />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[
                        styles.alertContainer,
                        {
                            opacity: backdropOpacity.current,
                            transform: [{ scale: scaleAnim.current }],
                        },
                    ]}
                >
                    {header && <View style={styles.header}>{header}</View>}
                    {content && <View style={styles.content}>{content}</View>}
                    {footer && <View style={styles.footer}>{footer}</View>}
                </Animated.View>
            </View>
        </Modal>
    );
};
