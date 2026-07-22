import { useCallback, useMemo } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';
import SwipeableRow from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { DeleteForeverIcon } from '@assets/icons/DeleteForeverIcon';
import { useNotificationListItem } from './presenters/useNotificationListItem';
import { getStyles } from './styles';
import { IClientNotification } from '@/entities/notifications/types/IClientNotification';

interface IProps {
    item: IClientNotification;
}

export const NotificationListItem = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, item.isRead), [colors, item.isRead]);
    const { sentAt, isDeleting, onPress, onDeletePress } = useNotificationListItem({ item });

    const renderRightActions = useCallback(
        () => (
            <View style={styles.rightActionContainer}>
                <TouchableOpacity style={styles.deleteButton} onPress={onDeletePress} disabled={isDeleting}>
                    {isDeleting ? (
                        <ActivityIndicator color={colors.text_inverted} />
                    ) : (
                        <DeleteForeverIcon width={28} height={28} color={colors.text_inverted} />
                    )}
                </TouchableOpacity>
            </View>
        ),
        [colors.text_inverted, isDeleting, onDeletePress, styles.deleteButton, styles.rightActionContainer],
    );

    return (
        <SwipeableRow containerStyle={styles.swipeContainer} renderRightActions={renderRightActions} overshootRight={false}>
            <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={1}>
                <Image source={require('@assets/images/app_icon.png')} style={styles.appIcon} />
                <View style={styles.content}>
                    <Typography text={item.title} variant="body_500" style={styles.title} numberOfLines={2} />
                    <Typography text={item.body} variant="body_400" style={styles.body} numberOfLines={3} />
                </View>
                <Typography text={sentAt} variant="subtitle_12_400" style={styles.time} numberOfLines={1} />
            </TouchableOpacity>
        </SwipeableRow>
    );
};
