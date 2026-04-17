import { useState, useMemo, useCallback, useEffect } from 'react';
import { useUiContext } from '@/UIProvider';

interface IUseWinePeakPickerParams {
    value: number | null;
    onChange: (year: number | null) => void;
}

export const useWinePeakPicker = ({ value, onChange }: IUseWinePeakPickerParams) => {
    const { t } = useUiContext();

    const currentYear = new Date().getFullYear();
    const [isVisible, setIsVisible] = useState(false);

    const [selectedYear, setSelectedYear] = useState(() => {
        if (value && value >= currentYear) {
            return value;
        }
        return currentYear;
    });

    useEffect(() => {
        if (value && value >= currentYear) {
            setSelectedYear(value);
        }
    }, [value, currentYear]);

    const handleOpen = useCallback(() => {
        setIsVisible(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const handleConfirm = useCallback(() => {
        if (selectedYear >= currentYear) {
            onChange(selectedYear);
        }
    }, [selectedYear, onChange, currentYear]);

    const onConfirm = useCallback(() => {
        handleConfirm();
        handleClose();
    }, [handleConfirm, handleClose]);

    const handleReset = useCallback(() => {
        onChange(null);
        handleClose();
    }, [onChange, handleClose]);

    const displayYear = useMemo(() => {
        if (value && value >= currentYear) {
            return String(value);
        }
        return t('wine.selectYear');
    }, [value, currentYear, t]);

    return {
        t,
        selectedYear,
        setSelectedYear,
        displayYear,
        currentYear,
        isVisible,
        handleOpen,
        handleClose,
        onConfirm,
        handleReset,
    };
};
