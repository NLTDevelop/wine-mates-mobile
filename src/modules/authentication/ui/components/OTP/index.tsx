import { RefObject, useMemo } from 'react';
import { CodeField, Cursor, RenderCellOptions } from 'react-native-confirmation-code-field';
import { useUiContext } from '../../../../../UIProvider';
import { getStyles } from './styles';
import { ImageBackground, Text, TextInput, View } from 'react-native';
import { isIOS } from '../../../../../utils';

interface IProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  ref: RefObject<TextInput>;
  props: any;
  getCellOnLayoutHandler: (index: number) => void;
  cellCount: number;
}

export const OTP = ({ ref, value, setValue, props, getCellOnLayoutHandler, cellCount }: IProps) => {
  const { colors } = useUiContext();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={cellCount}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        InputComponent={TextInput}
        autoComplete={isIOS ? 'one-time-code' : 'sms-otp'}
        renderCell={({ index, symbol, isFocused }: RenderCellOptions) => (
          <ImageBackground
            key={index}
            source={require('../../../../../assets/image/background.png')}
            style={styles.inputContainer}>
            <Text style={[styles.cell, isFocused && styles.focusCell]} onLayout={_ => getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </ImageBackground>
        )}
      />
    </View>
  );
};
