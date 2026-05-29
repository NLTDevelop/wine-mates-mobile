/* eslint-disable react-hooks/set-state-in-effect */
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

    const onOpen = useCallback(() => {
        setIsVisible(true);
    }, []);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onConfirmYear = useCallback(() => {
        if (selectedYear >= currentYear) {
            onChange(selectedYear);
        }
    }, [selectedYear, onChange, currentYear]);

    const onConfirm = useCallback(() => {
        onConfirmYear();
        onClose();
    }, [onConfirmYear, onClose]);

    const onReset = useCallback(() => {
        onChange(null);
        onClose();
    }, [onChange, onClose]);

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
        onOpen,
        onClose,
        onConfirm,
        onReset,
    };
};
