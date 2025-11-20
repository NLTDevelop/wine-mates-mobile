import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Slider } from '@/UIKit/Slider';
import { IWineTasteCharacteristics } from '@/entities/wine/types/IWineTasteCharacteristics';

interface IProps {
    item: IWineTasteCharacteristics;
    onChange: () => void;
}

export const TasteCharacteristicItem = ({ item, onChange }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Typography text={item.title} variant="body_500" />
            <Typography text={item.description} variant="body_500" />
            <Slider min={1} max={10} value={} onChange={onChange} selectedColor={item.hexColor} />
        </View>
    );
};
