import { memo, useMemo, forwardRef } from 'react';
import { TextInput, View, TouchableOpacity, ViewStyle, TextInputProps } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { EyeIcon } from '@assets/icons/EyeIcon';
import { EyeOffIcon } from '@assets/icons/EyeOffIcon';
import { useCustomInput } from './presenters/useCustomInput';

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
        const { isFocused, isPasswordVisible, setPasswordVisible, handleFocus, handleBlur, inputRef }
            = useCustomInput({ secureTextEntry, ...props }, ref);
        const styles = useMemo(() => getStyles(colors, isFocused), [colors, isFocused]);

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
