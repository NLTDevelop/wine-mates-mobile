import { ReactNode, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { colorTheme } from '@/UIProvider/theme/ColorTheme';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { useCustomToast } from '../../presenters/useCustomToast';

export enum ToastTypesEnum {
    success = 'success',
    error = 'error',
    info = 'info',
    warning = 'warning',
}

interface IProps {
    text1: string;
    text2?: string;
    Icon?: ReactNode;
    type: ToastTypesEnum;
}

const getBackgroundColor = (type: ToastTypesEnum) => {
    const toastColor = {
        [ToastTypesEnum.success]: colorTheme.colors.success,
        [ToastTypesEnum.error]: colorTheme.colors.error,
        [ToastTypesEnum.info]: colorTheme.colors.info,
        [ToastTypesEnum.warning]: colorTheme.colors.warning,
    };

    return toastColor[type];
};

export const CustomToast = ({ text1, text2, Icon, type }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const backgroundColor = useMemo(() => getBackgroundColor(type), [type]);
    const { onHide } = useCustomToast();
    
    return (
        <View style={[styles.successContainer, { backgroundColor }]}>
            {Icon}
            <View style={styles.textContainer}>
                <Typography text={text1} variant="h6" style={styles.text} />
                {text2 && <Typography text={text2} variant="body_400" style={styles.text} />}
            </View>
            <TouchableOpacity onPress={onHide}>
                <CrossIcon width={24} height={24} color={colors.icon_inverted}/>
            </TouchableOpacity>
        </View>
    );
};
