import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ISelectedSmell } from '@/modules/scanner/presenters/useWineSmell';

interface IProps {
    item: ISelectedSmell;
    onPress: () => void;
}

export const SelectedItems = ({ item, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, item.color), [colors, item]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Typography text={item.value} variant="body_400" />
        </TouchableOpacity>
    );
};
