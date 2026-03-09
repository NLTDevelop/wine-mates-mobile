import { useCallback } from 'react';

interface IUseFilterSectionProps {
    multipleSelect: boolean;
    onChange: (selected: (string | number)[]) => void;
    selectedValues: (string | number)[];
}

export const useFilterSection = ({ multipleSelect, onChange, selectedValues }: IUseFilterSectionProps) => {
    const onItemPress = useCallback((value: string | number) => {
        let newSelected: (string | number)[];

        if (multipleSelect) {
            if (selectedValues.includes(value)) {
                newSelected = selectedValues.filter(v => v !== value);
            } else {
                newSelected = [...selectedValues, value];
            }
        } else {
            newSelected = selectedValues.includes(value) ? [] : [value];
        }

        onChange(newSelected);
    }, [selectedValues, multipleSelect, onChange]);

    const isSelected = useCallback((value: string | number) => {
        return selectedValues.includes(value);
    }, [selectedValues]);

    const handleItemPress = useCallback((value: string | number) => () => {
        onItemPress(value);
    }, [onItemPress]);

    return { onItemPress, isSelected, handleItemPress };
};
