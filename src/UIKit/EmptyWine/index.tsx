import { View, ViewStyle } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { EmptyWineIcon } from '@assets/icons/EmptyWineIcon';
import { getStyles } from './styles';

interface IProps {
    containerStyle?: ViewStyle;
    iconWidth?: number;
    iconHeight?: number;
    iconColor?: string;
}

export const EmptyWine = ({ containerStyle, iconWidth, iconHeight, iconColor }: IProps) => {
    const { colors } = useUiContext();
    const styles = getStyles(colors);

    return (
        <View style={[styles.container, containerStyle]}>
            <EmptyWineIcon width={iconWidth} height={iconHeight} color={iconColor} />
        </View>
    );
};
