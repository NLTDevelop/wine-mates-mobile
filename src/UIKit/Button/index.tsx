import { useMemo, memo } from 'react';
import { ActivityIndicator, View, ViewStyle, TouchableOpacity, TextStyle, TouchableOpacityProps, Keyboard, } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { Typography } from '@/UIKit/Typography';

interface IProps extends TouchableOpacityProps {
    containerStyle?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle;
    text: string;
    type?: 'main' | 'secondary' | 'auth' | 'light' | 'disabled';
    RightAccessory?: React.ReactNode;
    LeftAccessory?: React.ReactNode;
    inProgress?: boolean;
}

export const ButtonComponent = ({ text, type = 'main', disabled, RightAccessory, LeftAccessory, containerStyle,
    textStyle, inProgress, ...props }: IProps) => {
    const resolvedType = disabled ? 'disabled' : type;
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, resolvedType), [colors, resolvedType]);

    return (
        <TouchableOpacity {...props} activeOpacity={resolvedType === "main" ? 0.9: 0.5} disabled={inProgress || disabled} style={[styles.container, containerStyle]} onPressIn={Keyboard.dismiss}>
            {inProgress ? (
                <View style={styles.absoluteSheet}>
                    <ActivityIndicator color={resolvedType === 'main' ? colors.background : colors.primary} size="small" />
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
};

export const Button = memo(ButtonComponent);
Button.displayName = 'Button';
