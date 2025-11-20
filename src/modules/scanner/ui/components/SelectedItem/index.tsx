import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ISelectedSmell } from '@/modules/scanner/presenters/useWineSmell';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';

interface IProps {
    item: ISelectedSmell | IWineTaste;
    onPress: () => void;
}

export const SelectedItems = ({ item, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, item.colorHex || colors.success), [colors, item]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Typography text={item.name || item.nameEn} variant="body_400" />
        </TouchableOpacity>
    );
};
