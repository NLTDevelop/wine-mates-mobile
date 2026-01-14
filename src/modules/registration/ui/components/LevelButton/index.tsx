import { ReactElement, useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon';

interface IProps {
    text: string;
    typeIcon: ReactElement;
    onPress: () => void;
}

export const LevelButton = ({ text, typeIcon, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {typeIcon}
            <Typography variant="h5" text={text} />
            <NextArrowIcon />
        </TouchableOpacity>
    );
};
