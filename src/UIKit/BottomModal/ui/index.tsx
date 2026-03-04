import { useEffect, useMemo, ReactNode, useState } from 'react';
import { View, Modal, TouchableWithoutFeedback, Animated, Dimensions, ScrollView, Pressable } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { TitleVariant, Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { useBottomModal } from '@/UIKit/BottomModal/presenters/useBottomModal';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface IBottomModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    titleVariant?: TitleVariant;
    customHeader?: ReactNode;
    children: ReactNode;
}

export const BottomModal = ({
    visible,
    onClose,
    title,
    titleVariant = 'h4',
    customHeader,
    children
}: IBottomModalProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const [isVisible, setIsVisible] = useState(visible);

    const { backdropOpacity, slideAnim, handleOpen, handleClose } = useBottomModal({
        onClose: () => {
            setIsVisible(false);
            onClose();
        }
    });

    useEffect(() => {
        if (visible) {
            setIsVisible(true);
            handleOpen();
        } else if (isVisible) {
            handleClose();
        }
    }, [visible, isVisible, handleOpen, handleClose]);

    const renderHeader = () => {
        if (customHeader) {
            return customHeader;
        }

        return (
            <View style={styles.header}>
                <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
                    <Typography text="✕" variant="h4" style={styles.closeIcon} />
                </Pressable>
                {title && (
                    <Typography text={title} variant={titleVariant} style={styles.title} />
                )}
                <View style={styles.closeButton} />
            </View>
        );
    };

    if (!isVisible) {
        return null;
    }

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={handleClose}
        >
            <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View
                        style={[
                            styles.backdrop,
                            {
                                opacity: backdropOpacity,
                            },
                        ]}
                    />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[
                        styles.contentContainer,
                        {
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    {renderHeader()}
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {children}
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};
