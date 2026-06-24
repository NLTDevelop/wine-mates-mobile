import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { FilterIcon } from '@assets/icons/FilterIcon';
import { getStyles } from './styles';

interface IProps {
    count: number;
    onPress: () => void;
}

export const ResultsFilterButton = ({ count, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <FilterIcon width={44} height={44} />
            {count > 0 ? (
                <View style={styles.badge}>
                    <Typography
                        text={count.toString()}
                        variant="subtitle_8_400"
                        style={styles.badgeText}
                    />
                </View>
            ) : null}
        </TouchableOpacity>
    );
};
