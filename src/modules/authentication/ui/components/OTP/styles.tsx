import { StyleSheet } from 'react-native';
import { IColors } from '../../../../../UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '../../../../../utils';

export const getStyles = (colors: IColors) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      marginBottom: scaleVertical(16),
    },
    cell: {
      textAlign: 'center',
    },
    error: {
      borderColor: colors.error,
    },
    focusCell: {
      borderColor: colors.border_strong,
    },
    inputContainer: {
      height: scaleVertical(56),
      width: scaleHorizontal(80),
      borderWidth: 1,
      borderColor: colors.border,
      padding: 0,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
  });

  return styles;
};
