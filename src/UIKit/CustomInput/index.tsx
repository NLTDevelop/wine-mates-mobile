import { memo, useState, useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import { TextInput, View, Text, TouchableOpacity, ViewStyle, TextInputProps } from 'react-native';
import { useUiContext } from '../../UIProvider';
import { Typography } from '../../UIKit/Typography';
import { getStyles } from './styles';
import { EyeIcon } from '../../assets/icons/EyeIcon';
import { EyeOffIcon } from '../../assets/icons/EyeOffIcon';

interface IProps extends TextInputProps {
    RightAccessory?: React.ReactNode;
    LeftAccessory?: React.ReactNode;
    label?: string;
    error?: boolean;
    containerStyle?: ViewStyle;
    inputContainerStyle?: ViewStyle;
}

export const CustomInput = memo(forwardRef<TextInput, IProps>(
    ({ label, error, RightAccessory, LeftAccessory, containerStyle, secureTextEntry, inputContainerStyle, ...props }, ref) => {
        const { colors } = useUiContext();
        const [isFocused, setFocused] = useState(false);
        const [isPasswordVisible, setPasswordVisible] = useState(secureTextEntry);
        const inputRef = useRef<TextInput>(null);

        useImperativeHandle(ref, () => inputRef.current!, []);

        const styles = useMemo(() => getStyles(colors, isFocused), [colors, isFocused]);

        const handleFocus: TextInputProps['onFocus'] = e => {
            setFocused(true);
            props.onFocus?.(e);
          };
          
          const handleBlur: TextInputProps['onBlur'] = e => {
            setFocused(false);
            props.onBlur?.(e);
          };

        return (
            <View style={[styles.container, containerStyle]}>
                {!!label && <Typography variant="h6" text={label} style={styles.label} />}
                <View style={[styles.inputContainer, inputContainerStyle, error && styles.inputError]}>
                    {LeftAccessory}
                    <TextInput
                        ref={inputRef}
                        {...props}
                        style={[styles.input, props.multiline && styles.inputMultiline, props.style]}
                        placeholderTextColor={colors.text_light}
                        secureTextEntry={secureTextEntry && isPasswordVisible}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    {RightAccessory}
                    {typeof secureTextEntry === 'boolean' && (
                        <TouchableOpacity
                            onPress={() => setPasswordVisible(!isPasswordVisible)}
                            style={styles.iconContainer}
                            hitSlop={10}
                        >
                            {isPasswordVisible ? (
                                <EyeOffIcon/>
                            ) : (
                                <EyeIcon/>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
                {/* Check if is need */}
                {/* {!!error && <Text style={styles.errorText}>{error}</Text>} */}
            </View>
        );
    }),
);
