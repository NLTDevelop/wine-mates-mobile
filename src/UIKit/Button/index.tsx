import { useMemo, memo } from 'react';
import { ActivityIndicator, View, ViewStyle, TouchableOpacity, TextStyle, TouchableOpacityProps, } from 'react-native';
import { useUiContext } from '../../UIProvider';
import { getStyles } from './styles';
import { Typography } from '../Typography';

interface IProps extends TouchableOpacityProps {
    containerStyle?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle;
    text: string;
    type?: 'main' | 'secondary';
    RightAccessory?: React.ReactNode;
    LeftAccessory?: React.ReactNode;
    inProgress?: boolean;
}

export const Button = memo(({ text, type = 'main', disabled, RightAccessory, LeftAccessory, containerStyle, textStyle, inProgress, ...props }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, type), [colors, disabled, type]);

    return (
        <TouchableOpacity {...props} disabled={inProgress || disabled} style={[styles.container, containerStyle]}>
            {inProgress ? (
                <View style={styles.absoluteSheet}>
                    <ActivityIndicator color={colors.background} size="small" />
                </View>
            ) : (
                <>
                    {LeftAccessory}
                    <Typography variant="body_500" text={text} numberOfLines={1} style={[styles.text, textStyle]} />
                    {RightAccessory}
                </>
            )}
        </TouchableOpacity>
    );
},
);
