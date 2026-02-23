import { useMemo, useCallback, useState, useEffect } from 'react';

interface IUseYearPickerParams {
    value: number;
    onChange: (year: number) => void;
    minimumYear?: number;
    styles: any;
}

export const useYearPicker = ({ value, onChange, minimumYear, styles }: IUseYearPickerParams) => {
    const currentYear = new Date().getFullYear();

    const minYear = minimumYear || currentYear;
    const initialMaxYear = currentYear + 50;

    const [maxYear, setMaxYear] = useState(initialMaxYear);

    const data = useMemo(() => {
        const years: Array<{ value: number; label: string }> = [];
        for (let year = minYear; year <= maxYear; year++) {
            years.push({
                value: year,
                label: year.toString(),
            });
        }
        return years;
    }, [minYear, maxYear]);

    const handleValueChange = useCallback(({ item }: { item: { value: number; label: string } }) => {
        onChange(item.value);

        // Check if user is near the end (within last 10 years)
        if (item.value >= maxYear - 10) {
            setMaxYear(prev => prev + 50);
        }
    }, [onChange, maxYear]);

    useEffect(() => {
        // Also check on value change from outside
        if (value >= maxYear - 10) {
            setMaxYear(prev => prev + 50);
        }
    }, [value, maxYear]);

    return {
        data,
        handleValueChange,
    };
};
