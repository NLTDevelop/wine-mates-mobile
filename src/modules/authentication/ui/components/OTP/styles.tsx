import { StyleSheet } from 'react-native';
import { IColors } from '../../../../../UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '../../../../../utils';

export const getStyles = (colors: IColors) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background_inverted,
    },

    cell: {
      fontFamily: 'Montserrat-Medium',
      fontSize: scaleFontSize(19),
      lineHeight: scaleVertical(27),
      textAlign: 'center',
    },

    focusCell: {
      borderColor: colors.text,
    },

    inputContainer: {
      height: scaleVertical(60),
      width: scaleHorizontal(45),
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
