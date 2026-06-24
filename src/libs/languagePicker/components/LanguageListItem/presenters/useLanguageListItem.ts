import { useCallback } from 'react';
import { ILanguageOption } from '../../../types/ILanguageOption';

interface IProps {
    item: ILanguageOption;
    onPress: (item: ILanguageOption) => void;
}

export const useLanguageListItem = ({ item, onPress }: IProps) => {
    const onItemPress = useCallback(() => {
        onPress(item);
    }, [item, onPress]);

    return {
        onItemPress,
    };
};
