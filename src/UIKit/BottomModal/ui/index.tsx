import { useMemo, ReactNode } from 'react';
import { View, Modal, TouchableWithoutFeedback, Animated, ScrollView, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { TitleVariant, Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { useBottomModalState } from '@/UIKit/BottomModal/presenters/useBottomModalState';
import { useBottomModalInsets } from '@/UIKit/BottomModal/presenters/useBottomModalInsets';
import { CrossIcon } from '@assets/icons/CrossIcon';

interface IProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    titleVariant?: TitleVariant;
    customHeader?: ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
    children: ReactNode;
}


export const BottomModal = ({
    visible,
    onClose,
    title,
    titleVariant = 'h4',
    customHeader,
    contentContainerStyle,
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
                <View style={styles.closeButton} />
                {title && (
                    <View style={styles.titleContainer} pointerEvents="none">
                        <Typography text={title} variant={titleVariant} style={styles.title} />
                    </View>
                )}
                <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={8}>
                    <CrossIcon/>
                </TouchableOpacity>
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
                        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
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
