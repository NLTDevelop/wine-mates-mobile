import { memo, useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Pressable } from 'react-native';
import { Typography } from '@/UIKit/Typography';

interface IProps {
    tabName: string;
    isActive: boolean;
    onPress: () => void;
}

const GuestsTabItemViewComponent = ({ tabName, isActive, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, isActive), [colors, isActive]);

    return (
        <Pressable style={styles.container} onPress={onPress}>
            <Typography
                variant="body_500"
                text={tabName}
                style={styles.tabName}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
            />
        </Pressable>
    );
};

export const GuestsTabItemView = memo(GuestsTabItemViewComponent);
