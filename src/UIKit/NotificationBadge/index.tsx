import { memo, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { NotificationIcon } from '@assets/icons/NotificationIcon';
import { Typography } from '@/UIKit/Typography';
import { IProps } from './types/IProps';
import { useNotificationBadge } from './presenters/useNotificationBadge';

const NotificationBadgeComponent = ({ count = 0, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { showBadge, displayCount } = useNotificationBadge(count);

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
