import { ReactNode, useMemo } from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useUiContext } from '../../UIProvider';
import { getStyles } from './styles';
import { useBackButton } from './presenters/useBackButton';
import { ArrowIcon } from '../../assets/icons/ArrowIcon';
import { Typography } from '../Typography';
import { scaleVertical } from '../../utils';

interface IProps {
    title?: string;
    titleComponent?: ReactNode;
    titleContainerStyle?: ViewStyle;
    onPressBack?: () => void;
    backDisabled?: boolean;
    rightComponent?: ReactNode;
    containerStyle?: ViewStyle;
}

export const HeaderWithBackButton = ({ title, titleComponent, backDisabled, rightComponent, containerStyle,
    titleContainerStyle, onPressBack,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { onGoBack } = useBackButton(onPressBack);

    return (
        <View style={[styles.container, containerStyle]}>
            {backDisabled ? (
                <View style={styles.empty} />
            ) : (
                <TouchableOpacity style={styles.button} onPress={onGoBack}>
                    <ArrowIcon width={scaleVertical(20)} height={scaleVertical(20)} />
                </TouchableOpacity>
            )}

            <View style={[styles.titleContainer, titleContainerStyle]}>
                {titleComponent ? (
                    titleComponent
                ) : (
                    <Typography text={title} variant="h3" numberOfLines={1} />
                )}
            </View>

            {rightComponent ?? <View style={styles.empty} />}
        </View>
    );
};
