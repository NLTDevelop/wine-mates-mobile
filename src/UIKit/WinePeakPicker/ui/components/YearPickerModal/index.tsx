import { memo, useMemo } from 'react';
import { Modal, View, Pressable, TouchableOpacity, Animated } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { Button } from '@/UIKit/Button';
import { YearPicker } from '../YearPicker';
import { useYearPickerModal } from './presenters/useYearPickerModal';
import { getStyles } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    selectedYear: number;
    onYearChange: (year: number) => void;
    currentYear: number;
    title: string;
    confirmText: string;
}

export const YearPickerModal = memo(({
    visible,
    onClose,
    onConfirm,
    selectedYear,
    onYearChange,
    currentYear,
    title,
    confirmText,
}: IProps) => {

    const { colors } = useUiContext();
    const { bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);

    const { backdropOpacity, slideAnim, onClosePress } = useYearPickerModal({ visible, onClose });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClosePress}
        >
            <View style={styles.container}>
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                    <Pressable style={styles.backdropPressable} onPressIn={onClosePress} />
                </Animated.View>
                <Animated.View style={[styles.modalWrapper, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <View style={styles.headerSpacer} />
                            <Typography variant="h4" text={title} />
                            <TouchableOpacity onPressIn={onClosePress} hitSlop={20} style={styles.closeButton}>
                                <CrossIcon />
                            </TouchableOpacity>
                        </View>
                        <YearPicker
                            value={selectedYear}
                            onChange={onYearChange}
                            minimumYear={currentYear}
                        />
                        <Button type="main" onPress={onConfirm} text={confirmText} />
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
});

YearPickerModal.displayName = 'YearPickerModal';
