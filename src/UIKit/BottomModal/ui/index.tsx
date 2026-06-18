import { ReactNode, useMemo } from 'react';
import {
    Animated,
    Modal,
    Pressable,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useUiContext } from '@/UIProvider';
import { TitleVariant, Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { useBottomModal } from '@/UIKit/BottomModal/presenters/useBottomModal';

interface IProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    titleVariant?: TitleVariant;
    customHeader?: ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
    isFullScreen?: boolean;
    children: ReactNode;
}

export const BottomModal = ({
    visible,
    onClose,
    title,
    titleVariant = 'h4',
    customHeader,
    contentContainerStyle,
    isFullScreen = false,
    children,
}: IProps) => {
    const { colors } = useUiContext();

    const {
        bottomInset,
        modalContentStyle,
        onClosePress,
        onShow,
        panHandlers,
        backdropOpacity,
        animatedKeyboardContainerStyle,
        animatedKeyboardBackgroundStyle,
    } = useBottomModal({ onClose, isFullScreen });

    const styles = useMemo(() => getStyles(colors, bottomInset), [colors, bottomInset]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onClosePress}
            onShow={onShow}
        >
            <View style={styles.modalContainer}>
                <Animated.View
                    pointerEvents="box-none"
                    style={[
                        styles.backdrop,
                        {
                            opacity: backdropOpacity.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 0.5],
                            }),
                        },
                    ]}
                />
                <Reanimated.View style={[styles.keyboardBackground, animatedKeyboardBackgroundStyle]} />

                <Pressable style={StyleSheet.absoluteFill} onPress={onClosePress} />

                <Reanimated.View style={animatedKeyboardContainerStyle}>
                    <Animated.View style={[styles.modalContent, modalContentStyle]}>
                        <View style={[styles.container, isFullScreen && styles.fullScreenContainer]}>
                            <View {...panHandlers}>
                                <TouchableWithoutFeedback>
                                    {customHeader ? (
                                        <View>{customHeader}</View>
                                    ) : (
                                        <View style={styles.header}>
                                            <View style={styles.closeButton} />

                                            {title ? (
                                                <View style={styles.titleContainer} pointerEvents="none">
                                                    <Typography
                                                        text={title}
                                                        variant={titleVariant}
                                                        style={styles.title}
                                                    />
                                                </View>
                                            ) : null}

                                            <TouchableOpacity
                                                onPress={onClosePress}
                                                style={styles.closeButton}
                                                hitSlop={8}
                                            >
                                                <CrossIcon />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </TouchableWithoutFeedback>
                            </View>

                            <View
                                style={[
                                    styles.contentContainer,
                                    isFullScreen && styles.fullScreenContentContainer,
                                    contentContainerStyle,
                                ]}
                            >
                                {children}
                            </View>
                        </View>
                    </Animated.View>
                </Reanimated.View>
            </View>
        </Modal>
    );
};
