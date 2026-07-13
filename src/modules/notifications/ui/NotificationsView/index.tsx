import { useCallback, useMemo } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { IClientNotification } from '@/entities/notifications/types/IClientNotification';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { useRefresh } from '@/hooks/useRefresh';
import { EmptyMessageIcon } from '@assets/icons/EmptyMessageIcon';
import { NotificationListItem } from './components/NotificationListItem';
import { useNotificationsView } from './presenters/useNotificationsView';
import { getStyles } from './styles';

export const NotificationsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        notificationItems,
        isLoading,
        isLoadingMore,
        isMarkingAllRead,
        hasUnreadNotifications,
        onRefresh,
        onLoadMore,
        onMarkAllRead,
    } = useNotificationsView();
    const { refreshControl } = useRefresh(onRefresh);

    const keyExtractor = useCallback((item: IClientNotification) => item.id.toString(), []);
    const renderItem = useCallback(
        ({ item }: { item: IClientNotification }) => <NotificationListItem item={item} />,
        [],
    );

    const markAllButton = (
        <TouchableOpacity
            style={styles.markAllButton}
            onPress={onMarkAllRead}
            disabled={!hasUnreadNotifications || isMarkingAllRead}
        >
            <Typography
                text={t('notifications.markAllRead')}
                variant="subtitle_12_500"
                style={[styles.markAllText, !hasUnreadNotifications && styles.disabledText]}
                numberOfLines={2}
            />
        </TouchableOpacity>
    );

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            headerComponent={(
                <HeaderWithBackButton
                    title={t('notifications.title')}
                    isCentered
                    rightComponent={markAllButton}
                />
            )}
        >
            <FlatList
                style={styles.list}
                contentContainerStyle={styles.listContent}
                data={notificationItems}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                refreshControl={refreshControl}
                onEndReached={onLoadMore}
                onEndReachedThreshold={0.4}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={(
                    <EmptyListView
                        image={<EmptyMessageIcon />}
                        text={t('notifications.empty')}
                        isLoading={isLoading}
                    />
                )}
                ListFooterComponent={isLoadingMore ? <ListFooterLoader /> : null}
            />
        </ScreenContainer>
    );
});

NotificationsView.displayName = 'NotificationsView';
