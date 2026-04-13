import { useMemo, ReactNode } from 'react';
import { View, Modal, TouchableWithoutFeedback, Animated, ScrollView, Pressable } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { TitleVariant, Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { useBottomModalState } from '@/UIKit/BottomModal/presenters/useBottomModalState';
import { useBottomModalInsets } from '@/UIKit/BottomModal/presenters/useBottomModalInsets';

interface IProps {
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
}: IProps) => {
    const { colors } = useUiContext();
    const { bottomInset } = useBottomModalInsets();
    const styles = useMemo(() => getStyles(colors, bottomInset), [colors, bottomInset]);
    const { isVisible, backdropOpacity, slideAnim, handleClose } = useBottomModalState({ visible, onClose });

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
            navigationBarTranslucent
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
