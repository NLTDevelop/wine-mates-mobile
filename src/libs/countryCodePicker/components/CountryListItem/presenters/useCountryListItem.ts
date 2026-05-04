import { useCallback } from 'react';
import { ICountry } from '@/libs/countryCodePicker/types/ICountry';

interface IProps {
    item: ICountry;
    onCountryPress: (item: ICountry) => void;
}

export const useCountryListItem = ({ item, onCountryPress }: IProps) => {
    const onPress = useCallback(() => {
        onCountryPress(item);
    }, [item, onCountryPress]);

    return {
        onPress,
    };
};
