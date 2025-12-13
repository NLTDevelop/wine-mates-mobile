import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, bottomInset: number) =>
  StyleSheet.create({
    bottomSheetContainer: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    container: {
      paddingHorizontal: scaleHorizontal(16),
      gap: scaleVertical(24),
    },
    header: {
      marginTop: scaleVertical(15),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerSpacer: {
      width: scaleVertical(24),
    },
    inputContainer: {
      marginBottom: 0,
    },
    button: {
      marginBottom: bottomInset + scaleVertical(16),
    },
  });
