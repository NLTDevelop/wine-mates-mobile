import { useState, useMemo, useEffect } from 'react';
import { IDropdownItem } from '../types/IDropdownItem';

interface IProps {
    onPress: (item: IDropdownItem) => void;
    data: IDropdownItem[];
    onSelect?: () => Promise<boolean>;
    selectedValue?: string | number | null;
}

export const useCustomDropdown = ({ onPress, data, onSelect, selectedValue = null }: IProps) => {
    const [value, setValue] = useState<string | number | null>(selectedValue);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        Promise.resolve().then(() => setValue(selectedValue ?? null));
    }, [selectedValue]);

    const filteredData = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        return data.filter(item => item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q));
    }, [search, data]);

    const handleSelect = (item: IDropdownItem) => {
        setValue(item.value);
        onPress(item);
        setIsOpen(false);
        onSelect?.();
    };

    const handleOpen = async () => {
        setIsOpen(true);
    };

    return { value, isOpen, search, filteredData, handleSelect, setSearch, setIsOpen, handleOpen };
};
