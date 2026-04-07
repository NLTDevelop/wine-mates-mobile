import { ReactNode, useMemo } from 'react';
import { View, Modal, TouchableWithoutFeedback, Animated, Pressable } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { useCustomAlert } from '../presenters/useCustomAlert';
import { Typography } from '@/UIKit/Typography';
import { CrossIcon } from '@assets/icons/CrossIcon';

interface IProps {
    visible: boolean;
    onClose: () => void;
    header?: ReactNode | string;
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
                    {header && (
                        <View style={styles.header}>
                            {typeof header === 'string' ? (
                                <View style={styles.headerWithClose}>
                                    <View/>
                                    <Typography text={header} variant="h4" style={styles.headerText} />
                                    <Pressable onPress={handleClose} style={styles.closeButton}>
                                        <CrossIcon width={20} height={20} color={colors.text} />
                                    </Pressable>
                                </View>
                            ) : (
                                header
                            )}
                        </View>
                    )}
                    {content && <View style={styles.content}>{content}</View>}
                    {footer && <View style={styles.footer}>{footer}</View>}
                </Animated.View>
            </View>
        </Modal>
    );
};
