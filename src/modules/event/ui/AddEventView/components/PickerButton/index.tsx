import { Keyboard, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { useUiContext } from '@/UIProvider';

interface IProps {
    text: string;
    onPress: () => void;
    style: StyleProp<ViewStyle>;
    isDisabled?: boolean;
}

export const PickerButton = ({ text, onPress, style, isDisabled = false }: IProps) => {
    const { colors } = useUiContext();
    const textColor = isDisabled ? colors.text_light : colors.text;

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={Keyboard.dismiss}
            style={style}
            disabled={isDisabled}
        >
            <Typography variant="h6" text={text} style={{ color: textColor }} />
            <ArrowDownIcon color={textColor} />
        </TouchableOpacity>
    );
};
