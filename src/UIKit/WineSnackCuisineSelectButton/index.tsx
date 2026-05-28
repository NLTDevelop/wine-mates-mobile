import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { getStyles } from './styles';

interface IProps {
    onPress: () => void;
}

export const WineSnackCuisineSelectButton = ({ onPress }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Typography variant="h6" text={t('wine.snackCuisines')} />
            <ArrowDownIcon />
        </TouchableOpacity>
    );
};
