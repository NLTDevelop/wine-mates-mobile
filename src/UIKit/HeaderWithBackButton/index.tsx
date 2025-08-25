import { ReactNode, useMemo } from 'react';
import { Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { useUiContext } from '../../UIProvider';
import { getStyles } from './styles';
import { ArrowIcon } from '../../assets/icons/common/ArrowIcon';
import { useBackButton } from './presenters/useBackButton';

interface IProps {
    title?: string;
    titleComponent?: ReactNode;
    backIconColor?: string;
    titleContainerStyle?: ViewStyle;
    onPressBack?: () => void;
    backDisabled?: boolean;
    rightComponent?: ReactNode;
    containerStyle?: ViewStyle;
}

export const HeaderWithBackButton = ({ title, titleComponent, backDisabled, rightComponent, containerStyle,
    titleContainerStyle, backIconColor, onPressBack,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { onGoBack } = useBackButton(onPressBack);

    return (
        <View style={[styles.container, containerStyle]}>
            {backDisabled ? null : (
                <TouchableOpacity style={styles.button} onPress={onGoBack}>
                    <ArrowIcon color={backIconColor || colors.icon_middle} />
                </TouchableOpacity>
            )}
            <View style={[styles.titleContainer, { paddingRight: backDisabled ? 0 : 50 }, titleContainerStyle]}>
                {titleComponent
                    ? titleComponent
                    : <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>}
            </View>
            {rightComponent}
        </View>
    );
};
