import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IWineEvolutionAgeControl } from '@/modules/wine/types/IWineEvolution';
import { getStyles } from './styles';

interface IProps {
    control: IWineEvolutionAgeControl;
}

export const EvolutionAgeRatingFilter = ({ control }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(
        () => getStyles(colors, control.color, control.backgroundColor),
        [colors, control.backgroundColor, control.color],
    );

    return (
        <TouchableOpacity
            style={[styles.container, control.isActive ? styles.containerActive : styles.containerInactive]}
            onPress={control.onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.dot, control.isActive ? styles.dotActive : styles.dotInactive]} />
            <Typography
                text={control.title}
                variant="subtitle_10_400"
                style={control.isActive ? styles.text : styles.textInactive}
            />
        </TouchableOpacity>
    );
};
