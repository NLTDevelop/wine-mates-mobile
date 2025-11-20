import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IAroma, ISmellSubgroup } from '@/entities/wine/types/IWineSmell';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';

interface IProps {
    item: ISmellSubgroup | IAroma | IWineTaste;
    onPress: () => void;
}

export const SmellListItem = ({ item, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, item.colorHex ?? colors.primary), [colors, item]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Typography text={item.nameEn || item.name} variant="body_500" style={styles.text} numberOfLines={1}/>
        </TouchableOpacity>
    );
};
