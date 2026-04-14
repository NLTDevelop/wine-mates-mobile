import { useCallback } from 'react';

interface IProps {
    onPress: () => void;
}

export const useSearchClearButton = ({ onPress }: IProps) => {
    const onButtonPress = useCallback(() => {
        onPress();
    }, [onPress]);

    return {
        onButtonPress,
    };
};
