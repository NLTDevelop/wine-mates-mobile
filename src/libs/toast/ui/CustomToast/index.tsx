import { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '../../../../UIProvider';
import { Typography } from '../../../../UIKit/Typography';
import { colorTheme } from '../../../../UIProvider/theme/ColorTheme';

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
        [ToastTypesEnum.error]: colorTheme.colors.pyro,
        [ToastTypesEnum.info]: colorTheme.colors.blue_100,
        [ToastTypesEnum.warning]: colorTheme.colors.orange_100,
    };

    return toastColor[type];
};

export const CustomToast = ({ text1, text2, Icon, type }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const backgroundColor = useMemo(() => getBackgroundColor(type), [type]);

    return (
        <View style={[styles.successContainer, { backgroundColor }]}>
            {Icon}
            <View style={styles.textContainer}>
                <Typography text={text1} variant="h6" style={styles.text} />
                {text2 && <Typography text={text2} variant="subtitle_12_500" style={styles.text} />}
            </View>
        </View>
    );
};
