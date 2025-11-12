import { useState, useMemo } from 'react';
import { IDropdownItem } from '../types/IDropdownItem';

interface IProps {
    onPress: (item: string) => void;
    data: IDropdownItem[];
    isLoadingError: boolean;
    onRetry?: () => Promise<boolean>;
}

export const useCustomDropdown = ({onPress, data, isLoadingError, onRetry}: IProps) => {
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

    const handleOpen = async () => {
        if (isLoadingError && onRetry) {
            const success = await onRetry();
            if (success) {
                setIsOpen(true);
            }
        } else {
            setIsOpen(true);
        }
    };

    return { value, isOpen, search, filteredData, handleSelect, setSearch, setIsOpen, handleOpen };
};
