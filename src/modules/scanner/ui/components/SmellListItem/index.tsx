import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IAroma, ISmellSubgroup, IWineSmell } from '@/entities/wine/types/IWineSmell';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';
import { IWineAroma } from '@/entities/wine/types/IWineAroma';
import { TickIcon } from '@assets/icons/TickIcon';

interface IProps {
    item: ISmellSubgroup | IAroma | IWineTaste | IWineAroma | IWineSmell;
    onPress: () => void;
    isSelected?: boolean;
}

export const SmellListItem = ({ item, onPress, isSelected = false }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, item.colorHex ?? colors.background_grey), [colors, item]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Typography text={item.name} variant="body_500" style={styles.text} numberOfLines={1}/>
            {isSelected && <View style={styles.selectedContainer}>
                <TickIcon/>
            </View>}
        </TouchableOpacity>
    );
};
