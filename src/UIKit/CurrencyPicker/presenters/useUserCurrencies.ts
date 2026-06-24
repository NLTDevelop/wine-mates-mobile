import { useCallback, useState } from 'react';
import { userService } from '@/entities/users/UserService';

export const useUserCurrencies = () => {
    const [currencies, setCurrencies] = useState<string[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [isCurrenciesLoading, setIsCurrenciesLoading] = useState(false);

    const onLoadCurrencies = useCallback(async () => {
        try {
            setIsCurrenciesLoading(true);

            const response = await userService.getCurrencies();

            if (response.isError || !response.data || !Array.isArray(response.data.list)) {
                return null;
            }

            setCurrencies(response.data.list);
            setSelectedCurrency(response.data.selected || '');

            return response.data;
        } catch (error) {
            console.warn('useUserCurrencies -> onLoadCurrencies: ', error);
            return null;
        } finally {
            setIsCurrenciesLoading(false);
        }
    }, []);

    return {
        currencies,
        selectedCurrency,
        isCurrenciesLoading,
        onLoadCurrencies,
    };
};
