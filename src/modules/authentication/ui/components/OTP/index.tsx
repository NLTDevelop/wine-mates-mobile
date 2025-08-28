import { RefObject, useMemo } from 'react';
import { CodeField, Cursor, RenderCellOptions } from 'react-native-confirmation-code-field';
import { useUiContext } from '../../../../../UIProvider';
import { getStyles } from './styles';
import { TextInput, View } from 'react-native';
import { isIOS } from '../../../../../utils';
import { Typography } from '../../../../../UIKit/Typography';

interface IProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    ref: RefObject<TextInput | null>;
    props: any;
    getCellOnLayoutHandler: (index: number) => void;
    cellCount: number;
    isError?: boolean;
}

export const OTP = ({ ref, value, setValue, props, getCellOnLayoutHandler, cellCount, isError }: IProps) => {
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
                    <View key={index} style={[styles.inputContainer, isError && styles.error]}>
                        <Typography
                            variant="body_400"
                            style={[styles.cell, isFocused && styles.focusCell]}
                            onLayout={_ => getCellOnLayoutHandler(index)}
                        >
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Typography>
                    </View>
                )}
            />
        </View>
    );
};
