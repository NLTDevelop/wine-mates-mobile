import { Keyboard, TouchableOpacity, View } from 'react-native';
import { useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { getStyles } from './styles';

interface IProps {
    text: string;
    onPress: () => void;
    isDisabled?: boolean;
    label?: string;
    placeholder?: string;
}

export const PickerButton = ({ text, onPress, isDisabled = false, label, placeholder = '' }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const displayedText = text || placeholder;
    const isPlaceholder = !text;
    const textColor = isDisabled || isPlaceholder ? colors.text_light : colors.text;

    return (
        <View style={label ? styles.containerWithLabel : undefined}>
            {label ? <Typography variant="h6" text={label} style={styles.label} /> : null}
            <TouchableOpacity
                onPress={onPress}
                onPressIn={Keyboard.dismiss}
                style={[styles.button, isDisabled ? styles.buttonDisabled : undefined]}
                disabled={isDisabled}
            >
                <Typography variant="h6" text={displayedText} numberOfLines={1} style={[styles.text, { color: textColor }]} />
                <ArrowDownIcon color={textColor} />
            </TouchableOpacity>
        </View>
    );
};
