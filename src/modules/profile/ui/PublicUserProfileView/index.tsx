import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { IEvent } from '@/entities/events/types/IEvent';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { useUiContext } from '@/UIProvider';
import { useRefresh } from '@/hooks/useRefresh';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { EventCard } from '@/UIKit/EventCard';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { Loader } from '@/UIKit/Loader';
import { Button } from '@/UIKit/Button';
import { Gallery } from '@/UIKit/Gallery';
import { PublicProfileHeader } from '@/modules/profile/ui/components/PublicProfileHeader';
import { PublicProfileTabs } from '@/modules/profile/ui/components/PublicProfileTabs';
import { PublicProfileLinksModal } from '@/modules/profile/ui/components/PublicProfileLinksModal';
import { usePublicUserProfile } from './presenters/usePublicUserProfile';
import { getStyles } from './styles';

export const PublicUserProfileView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        events,
        tabs,
        linkItems,
        hasLinks,
        profileGallery,
        galleryBadgeText,
        fullName,
        avatarUrl,
        isLoading,
        isError,
        isEventsLoading,
        isEventsLoadingMore,
        isFollowDisabled,
        isLinksModalVisible,
        onPressBack,
        onFollowPress,
        onRefresh,
        onLoadMoreEvents,
        onEventPress,
        onFavoriteEventPress,
        onShowLinksModal,
        onHideLinksModal,
        onAvatarPress,
    } = usePublicUserProfile();
    const { refreshControl } = useRefresh(onRefresh);
    const keyExtractor = useCallback((item: IEvent) => item.id.toString(), []);
    const renderItem = useCallback<ListRenderItem<IEvent>>(
        ({ item }) => (
            <EventCard
                event={item}
                isSelected={false}
                onReadMorePress={onEventPress}
                onCardPress={onEventPress}
                onFavoritePress={onFavoriteEventPress}
                eventStatusSource="tastingStatus"
            />
        ),
        [onEventPress, onFavoriteEventPress],
    );

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={onRefresh}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton onPressBack={onPressBack} />}
            >
                {isLoading && !fullName ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={events}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        refreshControl={refreshControl}
                        onEndReached={onLoadMoreEvents}
                        onEndReachedThreshold={0.4}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                            <View style={styles.headerContent}>
                                <PublicProfileHeader
                                    name={fullName}
                                    avatarUrl={avatarUrl}
                                    galleryBadgeText={galleryBadgeText}
                                    hasLinks={hasLinks}
                                    onAvatarPress={onAvatarPress}
                                    onLinksPress={onShowLinksModal}
                                />
                                <Button
                                    type="secondary"
                                    text={t('publicProfile.follow')}
                                    disabled={isFollowDisabled}
                                    onPress={onFollowPress}
                                    containerStyle={styles.followButton}
                                />
                                <PublicProfileTabs items={tabs} />
                            </View>
                        }
                        ListEmptyComponent={
                            <EmptyListView isLoading={isEventsLoading} text={t('publicProfile.noEvents')} />
                        }
                        ListFooterComponent={isEventsLoadingMore ? <ListFooterLoader /> : null}
                    />
                )}
                <PublicProfileLinksModal
                    visible={isLinksModalVisible}
                    items={linkItems}
                    onClose={onHideLinksModal}
                />
                <Gallery title="" {...profileGallery} hideHeader hidePreview />
            </ScreenContainer>
        </WithErrorHandler>
    );
});

PublicUserProfileView.displayName = 'PublicUserProfileView';
