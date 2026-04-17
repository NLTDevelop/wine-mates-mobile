import { memo, useMemo } from 'react';
import { Modal, View, Pressable, TouchableOpacity, Animated } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { Button } from '@/UIKit/Button';
import { YearPicker } from './YearPicker';
import { useYearPickerModal } from './useYearPickerModal';
import { getYearPickerModalStyles } from './YearPickerModalStyles';

interface IProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onReset: () => void;
    selectedYear: number;
    onYearChange: (year: number) => void;
    currentYear: number;
    title: string;
    confirmText: string;
    resetText: string;
}

export const YearPickerModal = memo(({
    visible,
    onClose,
    onConfirm,
    onReset,
    selectedYear,
    onYearChange,
    currentYear,
    title,
    confirmText,
    resetText,
}: IProps) => {

    const { colors } = useUiContext();
    const styles = useMemo(() => getYearPickerModalStyles(colors), [colors]);

    const { backdropOpacity, slideAnim, handleClose } = useYearPickerModal({ visible, onClose });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                    <Pressable style={styles.backdropPressable} onPress={handleClose} />
                </Animated.View>
                <Animated.View style={[styles.modalWrapper, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={onReset} hitSlop={20}>
                                <Typography variant="body_400" text={resetText} style={styles.resetText} />
                            </TouchableOpacity>
                            <Typography variant="h4" text={title} />
                            <TouchableOpacity onPress={handleClose} hitSlop={20}>
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
