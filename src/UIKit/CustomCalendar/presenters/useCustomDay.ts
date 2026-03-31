import { useCallback } from 'react';
import { DateData } from 'react-native-calendars';

interface IProps {
    date: DateData;
    onPress?: (date: DateData) => void;
    isDisabled?: boolean;
}

export const useCustomDay = ({ date, onPress, isDisabled = false }: IProps) => {
    const onDayPress = useCallback(() => {
        if (!isDisabled) {
            onPress?.(date);
        }
    }, [date, isDisabled, onPress]);

    return { onDayPress };
};
