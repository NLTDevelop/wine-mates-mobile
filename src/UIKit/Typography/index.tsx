import { memo, useMemo } from 'react';
import { Text, TextProps } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyle } from './styles';

export type TitleVariant = 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body_400' | 'body_500' | 'subtitle_12_400' | 'subtitle_12_500' |
    'subtitle_20_500' | 'subtitle_20_700' | 'subtitle_10_400' | 'subtitle_8_400';

interface IProps extends TextProps {
  variant?: TitleVariant;
  text?: string | number;
}

const TypographyComponent = ({ variant = 'body_500', text, ...props }: IProps) => {
  const { colors } = useUiContext();
  const styles = useMemo(() => getStyle(colors), [colors]);

  return (
    <Text {...props} style={[styles[variant], props.style]}>
      {text || props.children}
    </Text>
  );
};

export const Typography = memo(TypographyComponent);
Typography.displayName = 'Typography';
