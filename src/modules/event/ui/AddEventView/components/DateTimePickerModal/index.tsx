import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import DatePicker from 'react-native-date-picker';
import { Button } from '@/UIKit/Button';

interface IProps {
    visible: boolean;
    mode: 'date' | 'time';
    date: Date;
    onClose: () => void;
    onConfirm: () => void;
    onDateChange: (date: Date) => void;
}

export const DateTimePickerModal = ({ visible, mode, date, onClose, onConfirm, onDateChange }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const title = mode === 'date' ? t('event.eventDate') : t('event.eventTime');

    return (
        <BottomModal visible={visible} onClose={onClose} title={title}>
            <View style={styles.container}>
                <DatePicker
                    mode={mode}
                    date={date}
                    onDateChange={onDateChange}
                    theme={colors.background === '#FFFFFF' ? 'light' : 'dark'}
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
