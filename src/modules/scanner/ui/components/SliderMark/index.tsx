import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';

export const SliderMark = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.markerWrapper}>
            <View style={styles.marker}>
                <View style={styles.markerInner} />
            </View>
        </View>
    );
};
