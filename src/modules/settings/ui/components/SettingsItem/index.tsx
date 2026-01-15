import { useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon';

interface IProps {
    item: { text: string; onPress: () => void; description?: string; hideIcon?: boolean; isPrimary?: boolean };
    isLast?: boolean;
}

export const SettingsItem = ({ item, isLast = false }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, item.isPrimary || false, isLast), [colors, item.isPrimary, isLast]);

    return (
        <TouchableOpacity style={styles.container} onPress={item.onPress}>
            <Typography variant="h6" text={item.text} style={styles.title} />
            <View style={styles.row}>
                {item.description && <Typography variant="body_400" text={item.description} style={styles.text} />}
                {!item.hideIcon && <NextArrowIcon color={colors.icon} />}
            </View>
        </TouchableOpacity>
    );
};
