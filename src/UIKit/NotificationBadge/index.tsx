import { memo, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { NotificationIcon } from '@assets/icons/NotificationIcon';
import { Typography } from '@/UIKit/Typography';

interface IProps {
    count?: number;
    onPress?: () => void;
}

const NotificationBadgeComponent = ({ count = 0, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const showBadge = count > 0;
    const displayCount = count > 99 ? '99+' : count.toString();

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.container}>
            <NotificationIcon color={colors.text} />
            {showBadge && (
                <View style={styles.badge}>
                    <Typography text={displayCount} variant="subtitle_12_400" style={styles.badgeText} />
                </View>
            )}
        </TouchableOpacity>
    );
};

export const NotificationBadge = memo(NotificationBadgeComponent);
