import { useCallback, useState } from 'react';

type PickerMode = 'date' | 'time';

interface IUseDateTimePickerProps {
    onDateSelect: (date: Date) => void;
    onTimeSelect: (date: Date) => void;
}

export const useDateTimePicker = ({ onDateSelect, onTimeSelect }: IUseDateTimePickerProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [mode, setMode] = useState<PickerMode>('date');
    const [pickerDate, setPickerDate] = useState(new Date());

    const openDatePicker = useCallback(() => {
        setMode('date');
        setIsVisible(true);
    }, []);

    const openTimePicker = useCallback(() => {
        setMode('time');
        setIsVisible(true);
    }, []);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onConfirm = useCallback(() => {
        if (mode === 'date') {
            onDateSelect(pickerDate);
        } else {
            onTimeSelect(pickerDate);
        }
        setIsVisible(false);
    }, [mode, pickerDate, onDateSelect, onTimeSelect]);

    const onDateChange = useCallback((date: Date) => {
        setPickerDate(date);
    }, []);

    return {
        isVisible,
        mode,
        pickerDate,
        openDatePicker,
        openTimePicker,
        onClose,
        onConfirm,
        onDateChange,
    };
};
