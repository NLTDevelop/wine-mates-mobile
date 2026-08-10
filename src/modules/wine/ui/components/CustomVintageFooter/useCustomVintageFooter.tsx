import { useState, useCallback, useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

interface IProps {
    existingYears: number[];
    onAddVintage: (year: number) => void;
}

export const useCustomVintageFooter = ({ existingYears: _existingYears, onAddVintage }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const [isInputMode, setIsInputMode] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    const currentYear = new Date().getFullYear();

    const validateYear = useCallback((year: number): string => {
        if (year > currentYear) {
            return 'Cannot add future year';
        }

        return '';
    }, [currentYear]);

    const onButtonPress = useCallback(() => {
        setIsInputMode(true);
        setInputValue('');
        setError('');
    }, []);

    const onCancel = useCallback(() => {
        setIsInputMode(false);
        setInputValue('');
        setError('');
    }, []);

    const onConfirm = useCallback(() => {
        const year = parseInt(inputValue, 10);
        
        if (isNaN(year) || inputValue.length !== 4) {
            setError('Invalid year');
            return;
        }

        const validationError = validateYear(year);
        if (validationError) {
            setError(validationError);
            return;
        }

        onAddVintage(year);
        setIsInputMode(false);
        setInputValue('');
        setError('');
    }, [inputValue, validateYear, onAddVintage]);

    const onInputChange = useCallback((text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        if (numericText.length <= 4) {
            setInputValue(numericText);
            setError('');
        }
    }, []);

    return {
        isInputMode,
        inputValue,
        error,
        styles,
        t,
        onButtonPress,
        onCancel,
        onConfirm,
        onInputChange,
    };
};
