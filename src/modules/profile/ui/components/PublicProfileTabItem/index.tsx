import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { IPublicProfileTabItem } from '@/modules/profile/types/IPublicProfileTabItem';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IProps {
    item?: IPublicProfileTabItem;
}

export const PublicProfileTabItem = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    if (!item) {
        return null;
    }

    return (
        <TouchableOpacity style={styles.item} onPress={item.onPress} disabled={item.isDisabled} activeOpacity={0.8}>
            <Typography
                text={item.title}
                variant="body_500"
                style={item.isDisabled ? styles.disabledText : item.isSelected ? styles.selectedText : styles.text}
            />
            <View style={item.isSelected ? styles.selectedLine : styles.line} />
        </TouchableOpacity>
    );
};
