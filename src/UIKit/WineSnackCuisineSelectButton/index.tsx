import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { getStyles } from './styles';

interface IProps {
    text: string;
    onPress: () => void;
}

export const WineSnackCuisineSelectButton = ({ text, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Typography variant="h6" text={text} style={styles.text} numberOfLines={1} />
            <ArrowDownIcon />
        </TouchableOpacity>
    );
};
