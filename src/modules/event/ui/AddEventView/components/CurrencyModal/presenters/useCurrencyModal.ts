import { useCallback, useMemo, useState } from 'react';
import { ICurrencyOption } from '@/modules/event/types/ICurrencyOption';

interface IProps {
    items: ICurrencyOption[];
}

export const useCurrencyModal = ({ items }: IProps) => {
    const [search, setSearch] = useState('');

    const onChangeSearch = useCallback((value: string) => {
        setSearch(value);
    }, []);

    const filteredItems = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return items;
        }

        return items.filter((item) => item.label.toLowerCase().includes(normalizedSearch));
    }, [items, search]);

    return {
        search,
        filteredItems,
        onChangeSearch,
    };
};
