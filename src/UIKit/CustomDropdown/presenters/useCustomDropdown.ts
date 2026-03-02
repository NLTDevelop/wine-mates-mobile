import { useState, useMemo, useEffect } from 'react';
import { IDropdownItem } from '../types/IDropdownItem';

interface IProps {
    onPress: (item: IDropdownItem) => void;
    data: IDropdownItem[];
    onSelect?: () => Promise<boolean>;
    selectedValue?: string | number | null;
    emptyStateLabel?: string;
}

const EMPTY_STATE_VALUE = '__EMPTY_STATE__';

export const useCustomDropdown = ({ onPress, data, onSelect, selectedValue = null, emptyStateLabel }: IProps) => {
    const [value, setValue] = useState<string | number | null>(selectedValue);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        Promise.resolve().then(() => setValue(selectedValue ?? null));
    }, [selectedValue]);

    const filteredData = useMemo(() => {
        const baseData = !search.trim() ? data : data.filter(item => {
            const q = search.toLowerCase();
            return item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q);
        });
        
        if (emptyStateLabel) {
            return [{ label: emptyStateLabel, value: EMPTY_STATE_VALUE }, ...baseData];
        }
        
        return baseData;
    }, [search, data, emptyStateLabel]);

    const handleSelect = (item: IDropdownItem) => {
        if (item.value === EMPTY_STATE_VALUE) {
            setValue(null);
            onPress({ label: '', value: '', id: null });
        } else {
            setValue(item.value);
            onPress(item);
        }
        setIsOpen(false);
        onSelect?.();
    };

    const handleOpen = async () => {
        setIsOpen(true);
    };

    return { value, isOpen, search, filteredData, handleSelect, setSearch, setIsOpen, handleOpen };
};
