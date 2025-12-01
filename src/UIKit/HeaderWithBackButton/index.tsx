import { ReactNode, useMemo } from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { useBackButton } from './presenters/useBackButton';
import { ArrowIcon } from '@assets/icons/ArrowIcon';
import { Typography } from '@/UIKit/Typography';

interface IProps {
    title?: string;
    titleComponent?: ReactNode;
    titleContainerStyle?: ViewStyle;
    onPressBack?: () => void;
    backDisabled?: boolean;
    rightComponent?: ReactNode;
    containerStyle?: ViewStyle;
    isCentered?: boolean;
}

export const HeaderWithBackButton = ({ title, titleComponent, backDisabled, rightComponent, containerStyle,
    titleContainerStyle, onPressBack, isCentered = true,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, isCentered), [colors, isCentered]);
    const { onGoBack } = useBackButton(onPressBack);

    return (
        <View style={[styles.container, containerStyle]}>
            {backDisabled ? (
                <View style={styles.empty} />
            ) : (
                <TouchableOpacity style={styles.button} onPress={onGoBack}>
                    <ArrowIcon width={20} height={20} />
                </TouchableOpacity>
            )}

            <View style={[styles.titleContainer, titleContainerStyle]}>
                {titleComponent ? (
                    titleComponent
                ) : (
                    <Typography text={title} variant="h3" numberOfLines={1} style={styles.title}/>
                )}
            </View>

            {rightComponent ?? <View style={styles.empty} />}
        </View>
    );
};
