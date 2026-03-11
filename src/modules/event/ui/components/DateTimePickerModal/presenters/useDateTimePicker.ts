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

    const handleClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const handleConfirm = useCallback(() => {
        if (mode === 'date') {
            onDateSelect(pickerDate);
        } else {
            onTimeSelect(pickerDate);
        }
        setIsVisible(false);
    }, [mode, pickerDate, onDateSelect, onTimeSelect]);

    const handleDateChange = useCallback((date: Date) => {
        setPickerDate(date);
    }, []);

    return {
        isVisible,
        mode,
        pickerDate,
        openDatePicker,
        openTimePicker,
        handleClose,
        handleConfirm,
        handleDateChange,
    };
};
