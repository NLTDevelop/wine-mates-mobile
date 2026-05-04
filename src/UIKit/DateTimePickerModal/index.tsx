import { useMemo } from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { Button } from '@/UIKit/Button';
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
        <BottomModal visible={visible} onClose={onClose} title={modalTitle}>
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
        </BottomModal>
    );
};
