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
    minimumDate: Date;
    onClose: () => void;
    onConfirm: () => void;
    onDateChange: (date: Date) => void;
}

export const DateTimePickerModal = ({ visible, mode, date, minimumDate, onClose, onConfirm, onDateChange }: IProps) => {
    const { colors, t, locale } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const normalizedLocale = useMemo(() => {
        const preparedLocale = (locale || 'en').trim().replace('_', '-');

        if (!preparedLocale) {
            return 'en';
        }

        return preparedLocale;
    }, [locale]);
    const timePickerLocale = useMemo(() => {
        const languageCode = normalizedLocale.split('-')[0];

        if (!languageCode) {
            return 'en-001';
        }

        return `${languageCode}-001`;
    }, [normalizedLocale]);
    const pickerLocale = mode === 'time' ? timePickerLocale : normalizedLocale;

    const title = mode === 'date' ? t('event.eventDate') : t('event.eventTime');

    return (
        <BottomModal visible={visible} onClose={onClose} title={title}>
            <View style={styles.container}>
                <DatePicker
                    mode={mode}
                    date={date}
                    minimumDate={minimumDate}
                    onDateChange={onDateChange}
                    theme={colors.background === '#FFFFFF' ? 'light' : 'dark'}
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
