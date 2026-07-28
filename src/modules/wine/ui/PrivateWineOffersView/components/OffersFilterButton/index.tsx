import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { FilterIcon } from '@assets/icons/FilterIcon';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IProps {
    count: number;
    onPress: () => void;
}

export const OffersFilterButton = ({ count, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <FilterIcon width={40} height={40} />
            {count > 0 ? (
                <View style={styles.badge}>
                    <Typography text={count} variant="subtitle_8_400" style={styles.text} />
                </View>
            ) : null}
        </TouchableOpacity>
    );
};
