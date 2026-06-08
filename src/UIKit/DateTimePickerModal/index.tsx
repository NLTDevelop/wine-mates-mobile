import { useMemo } from 'react';
import { KeyboardAvoidingView, Modal, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useUiContext } from '@/UIProvider';
import { Button } from '@/UIKit/Button';
import { Typography } from '@/UIKit/Typography';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { ToastOverlay } from '@/libs/toast/ui/ToastOverlay';
import { getStyles } from './styles';
import { useDateTimePickerModal } from './presenters/useDateTimePickerModal';

interface IProps {
    visible: boolean;
    mode: 'date' | 'time';
    date: Date;
    minimumDate?: Date;
    maximumDate?: Date;
    title?: string;
    onClose: () => void;
    onConfirm: () => void;
    onDateChange: (date: Date) => void;
}

export const DateTimePickerModal = ({
    visible,
    mode,
    date,
    minimumDate,
    maximumDate,
    title,
    onClose,
    onConfirm,
    onDateChange,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { pickerLocale, modalTitle, pickerTheme } = useDateTimePickerModal({ mode, title });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>
            <KeyboardAvoidingView behavior="padding" style={styles.modalContainer}>
                <View style={styles.modalCard}>
                    <View style={styles.header}>
                        <View style={styles.closeButton} />
                        <View style={styles.titleContainer} pointerEvents="none">
                            <Typography text={modalTitle} variant="h4" style={styles.title} />
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={8}>
                            <CrossIcon />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.container}>
                        <DatePicker
                            mode={mode}
                            date={date}
                            minimumDate={minimumDate}
                            maximumDate={maximumDate}
                            onDateChange={onDateChange}
                            theme={pickerTheme}
                            locale={pickerLocale}
                            is24hourSource="locale"
                        />
                        <Button
                            text={t('common.confirm')}
                            onPress={onConfirm}
                            type="main"
                            containerStyle={styles.confirmButton}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
            {visible && <ToastOverlay />}
        </Modal>
    );
};
