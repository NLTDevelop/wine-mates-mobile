import { useCallback } from 'react';

interface IProps {
    onChangeText: (value: string) => void;
}

export const useSelectCityBottomSheet = ({ onChangeText }: IProps) => {
    const onClearSearch = useCallback(() => {
        onChangeText('');
    }, [onChangeText]);

    return {
        onClearSearch,
    };
};
