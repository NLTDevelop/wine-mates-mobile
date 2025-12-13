import { memo, useMemo, forwardRef, type ReactNode } from 'react';
import { TouchableOpacity, View, type ViewStyle, type TextInputProps, type TextInput } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { EyeIcon } from '@assets/icons/EyeIcon';
import { EyeOffIcon } from '@assets/icons/EyeOffIcon';
import { useCustomInput } from '@/UIKit/CustomInput/presenters/useCustomInput';
import { getStyles } from './styles';

interface IProps extends TextInputProps {
    RightAccessory?: ReactNode;
    LeftAccessory?: ReactNode;
    label?: string;
    error?: boolean;
    containerStyle?: ViewStyle;
    inputContainerStyle?: ViewStyle;
}

export const BottomSheetInput = memo(forwardRef<TextInput, IProps>(
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
                    <BottomSheetTextInput
                        //@ts-ignore
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
                                <EyeOffIcon />
                            ) : (
                                <EyeIcon />
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
