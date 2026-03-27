import { useMemo } from 'react';
import { getStyles } from './styles';
import { Keyboard, TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { format } from 'date-fns';

interface IProps {
    date: string | null;
    handlePress: () => void;
    isOpened: boolean;
    isError: boolean;
    displayText?: string;
    disabled?: boolean;
}

export const BirthdaySelector = ({ date, handlePress, isOpened, isError, displayText, disabled = false }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const formattedDate = useMemo(() => {
        if (!date) return '';
        const selectedDate = new Date(date);
        try {
            const formatted = format(selectedDate, 'dd/MM/yyyy');
            return `${t('registration.birthdayWithoutFormat')} (${formatted})`;
        } catch {
            return `${t('registration.birthday')}`;
        }
    }, [date, t]);

    return (
        <TouchableOpacity
            style={isError ? styles.containerError : styles.container}
            onPress={handlePress}
            onPressIn={Keyboard.dismiss}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.2}
        >
            <Typography variant="h6" text={displayText || formattedDate || t('registration.birthday')} />
            <ArrowDownIcon rotate={isOpened ? 180 : 0} />
        </TouchableOpacity>
    );
};
