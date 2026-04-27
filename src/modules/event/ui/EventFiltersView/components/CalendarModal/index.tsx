import { useMemo } from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { DateData } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CustomCalendar } from '@/UIKit/CustomCalendar';
import { Button } from '@/UIKit/Button';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    title: string;
    closeText: string;
    currentMonth: string;
    markedDates: MarkedDates;
    onClose: () => void;
    onDayPress: (item: DateData) => void;
    onMonthChange: (month: DateData) => void;
}

export const CalendarModal = ({
    visible,
    title,
    closeText,
    currentMonth,
    markedDates,
    onClose,
    onDayPress,
    onMonthChange,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

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
            <View style={styles.modalContainer}>
                <View style={styles.modalCard}>
                    <View style={styles.modalHeader}>
                        <Typography text={title} variant="h4" />
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <CrossIcon />
                        </TouchableOpacity>
                    </View>

                    <CustomCalendar
                        currentMonth={currentMonth}
                        markedDates={markedDates}
                        onDayPress={onDayPress}
                        handleMonthChange={onMonthChange}
                        calendarStyle={styles.calendar}
                    />

                    <Button
                        text={closeText}
                        onPress={onClose}
                        type="main"
                        containerStyle={styles.closeActionButton}
                    />
                </View>
            </View>
        </Modal>
    );
};
