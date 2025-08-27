import { memo, useMemo } from 'react';
import { Text, TextProps } from 'react-native';
import { useUiContext } from '../../UIProvider';
import { getStyle } from './styles';

interface IProps extends TextProps {
    variant: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body_400' | 'body_500' | 'subtitle_12_400';
    text?: string | number;
}

export const Typography = memo(({ variant = 'body_500', text, ...props }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyle(colors), [colors]);

    return (
        <Text {...props} style={[styles[variant], props.style]}>
            {text || props.children}
        </Text>
    );
});
