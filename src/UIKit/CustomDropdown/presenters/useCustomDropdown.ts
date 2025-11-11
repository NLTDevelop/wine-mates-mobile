import { useState, useMemo } from 'react';
import { IDropdownItem } from '../types/IDropdownItem';

export const useCustomDropdown = (onPress: (item: string) => void, data: IDropdownItem[]) => {
    const [value, setValue] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredData = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        return data.filter(item => item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q));
    }, [search, data]);

    const handleSelect = (item: IDropdownItem) => {
        setValue(item.value);
        onPress(item.value);
        setIsOpen(false);
    };

    return { value, isOpen, search, filteredData, handleSelect, setSearch, setIsOpen };
};
