import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { useMemo } from 'react';
import { Typography } from '@/UIKit/Typography';

interface IProps {
    label: string;
    onRemove: () => void;
}

export const FilterTag = ({ label, onRemove }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Typography variant="body_400" style={styles.label}>{label}</Typography>
            <TouchableOpacity onPress={onRemove} style={styles.closeButton}>
                <CrossIcon width={16} height={16} color={colors.background} />
            </TouchableOpacity>
        </View>
    );
};
