import { View } from 'react-native';
import { ColorButton } from '@/modules/scanner/ui/components/ColorButton';
import { IWineColorShade } from '@/entities/wine/types/IWineColorShade';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { useMemo } from 'react';

interface IProps {
    data: IWineColorShade[];
    selectedColor?: IWineColorShade;
    onSelectColor: (color: IWineColorShade) => void;
}

export const ColorSelector = ({ data, selectedColor, onSelectColor }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.colorsContainer}>
            {data.map((item: IWineColorShade, index: number) => (
                <ColorButton
                    key={index}
                    color={item}
                    isActive={item.id === selectedColor?.id}
                    onPress={() => onSelectColor(item)}
                    containerStyle={styles.colorButton}
                />
            ))}
        </View>
    );
};
