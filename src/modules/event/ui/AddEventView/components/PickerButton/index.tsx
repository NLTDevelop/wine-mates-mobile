import { Keyboard, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';

interface IProps {
    text: string;
    onPress: () => void;
    style: StyleProp<ViewStyle>;
}

export const PickerButton = ({ text, onPress, style }: IProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={Keyboard.dismiss}
            style={style}
        >
            <Typography variant="h6" text={text} />
            <ArrowDownIcon />
        </TouchableOpacity>
    );
};
