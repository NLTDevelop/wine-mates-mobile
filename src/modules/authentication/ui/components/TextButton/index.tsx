import { useMemo } from 'react';
import { TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { getStyle } from './styles';
import { useUiContext } from '../../../../../UIProvider';
import { Typography } from '../../../../../UIKit/Typography';

interface IProps {
  onPress: () => void;
  text: string;
  textStyles?: TextStyle;
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

export const TextButton = ({ text, onPress, textStyles, containerStyle = {}, disabled = false }: IProps) => {
  const { colors } = useUiContext();
  const styles = useMemo(() => getStyle(colors), [colors]);

  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress} disabled={disabled}>
      <Typography variant='body_500' text={text} style={textStyles}/>
    </TouchableOpacity>
  );
};
