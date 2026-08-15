import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { IEvent } from '@/entities/events/types/IEvent';
import { IUserTastingListItem } from '@/entities/wine/types/IUserTastingsList';
import { IOfferedWineListItem } from '@/entities/wine/types/IOfferedWineListItem';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { PublicProfileTab } from '@/modules/profile/enums/PublicProfileTab';
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
import { WineShareModal } from '@/UIKit/WineShareModal';
import { PublicProfileHeader } from '@/modules/profile/ui/components/PublicProfileHeader';
import { PublicProfileTabs } from '@/modules/profile/ui/components/PublicProfileTabs';
import { PublicProfileLinksModal } from '@/modules/profile/ui/components/PublicProfileLinksModal';
import { PublicUserTastingListItem } from './components/PublicUserTastingListItem';
import { WineryWineListItem } from '@/modules/profile/ui/components/WineryWineListItem';
import { usePublicUserProfile } from './presenters/usePublicUserProfile';
import { getStyles } from './styles';
import { EmptyWineListIcon } from '@assets/icons/EmptyWineListIcon';
import { WineListSearchBar } from '@/modules/profile/ui/components/WineListSearchBar';
import { WINE_LIST_PERFORMANCE_PROPS } from '@/UIKit/WineListItem/constants';

export const PublicUserProfileView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        activeTab,
        events,
        tastings,
        offers,
        tabs,
        linkItems,
        hasLinks,
        profileGallery,
        galleryBadgeText,
        fullName,
        avatarUrl,
        bio,
        ratingText,
        countryRankText,
        worldRankText,
        isLoading,
        isError,
        isEventsLoading,
        isEventsLoadingMore,
        isTastingsLoading,
        isTastingsLoadingMore,
        isOffersLoading,
        isOffersLoadingMore,
        isFollowDisabled,
        isLinksModalVisible,
        isShareModalVisible,
        tastingsListRef,
        onPressBack,
        onFollowPress,
        onRefresh,
        onLoadMoreEvents,
        onLoadMoreTastings,
        onLoadMoreOffers,
        onEventPress,
        onFavoriteEventPress,
        onTastingPress,
        onWinePress,
        onSearchTastings,
        scrollTastingsToTop,
        onOpenShareModal,
        onCloseShareModal,
        onShareMessengerPress,
        onCopyWineLinkPress,
        onShowLinksModal,
        onHideLinksModal,
        onAvatarPress,
    } = usePublicUserProfile();
    const { refreshControl } = useRefresh(onRefresh);
    const eventKeyExtractor = useCallback((item: IEvent) => item.id.toString(), []);
    const tastingKeyExtractor = useCallback(
        (item: IUserTastingListItem, index: number) => `${item.id.toString()}-${index}`,
        [],
    );
    const offerKeyExtractor = useCallback((item: IOfferedWineListItem) => item.id.toString(), []);
    const renderEventItem = useCallback<ListRenderItem<IEvent>>(
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
    const renderTastingItem = useCallback<ListRenderItem<IUserTastingListItem>>(
        ({ item }) => (
            <PublicUserTastingListItem item={item} onPress={onTastingPress} onSharePress={onOpenShareModal} />
        ),
        [onOpenShareModal, onTastingPress],
    );
    const renderOfferItem = useCallback<ListRenderItem<IOfferedWineListItem>>(
        ({ item }) => (
            <WineryWineListItem item={item} offer={item.offer} onPress={onWinePress} onSharePress={onOpenShareModal} />
        ),
        [onOpenShareModal, onWinePress],
    );
    const profileHeader = (
        <View>
            <PublicProfileHeader
                name={fullName}
                avatarUrl={avatarUrl}
                bio={bio}
                ratingText={ratingText}
                countryRankText={countryRankText}
                worldRankText={worldRankText}
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
            {activeTab === PublicProfileTab.TASTINGS ? (
                <View style={styles.tastingsSearch}>
                    <WineListSearchBar onSearch={onSearchTastings} scrollToTop={scrollTastingsToTop} />
                </View>
            ) : null}
        </View>
    );

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={onRefresh}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={
                    <HeaderWithBackButton onPressBack={onPressBack} title={t('common.back')} isCentered={false} />
                }
            >
                {isLoading && !fullName ? (
                    <Loader />
                ) : activeTab === PublicProfileTab.EVENTS ? (
                    <FlatList
                        data={events}
                        renderItem={renderEventItem}
                        keyExtractor={eventKeyExtractor}
                        refreshControl={refreshControl}
                        onEndReached={onLoadMoreEvents}
                        onEndReachedThreshold={0.4}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={profileHeader}
                        ListEmptyComponent={
                            <EmptyListView isLoading={isEventsLoading} text={t('publicProfile.noEvents')} />
                        }
                        ListFooterComponent={isEventsLoadingMore ? <ListFooterLoader /> : null}
                    />
                ) : activeTab === PublicProfileTab.WINES ? (
                    <FlatList
                        {...WINE_LIST_PERFORMANCE_PROPS}
                        data={offers}
                        renderItem={renderOfferItem}
                        keyExtractor={offerKeyExtractor}
                        refreshControl={refreshControl}
                        onEndReached={onLoadMoreOffers}
                        onEndReachedThreshold={0.4}
                        contentContainerStyle={styles.wineListContent}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={profileHeader}
                        ListEmptyComponent={
                            <EmptyListView
                                isLoading={isOffersLoading}
                                image={<EmptyWineListIcon />}
                                text={t('publicProfile.noOffers')}
                                description={t('wine.emptyListDescription')}
                            />
                        }
                        ListFooterComponent={isOffersLoadingMore ? <ListFooterLoader /> : null}
                    />
                ) : (
                    <FlatList
                        {...WINE_LIST_PERFORMANCE_PROPS}
                        ref={tastingsListRef}
                        data={tastings}
                        renderItem={renderTastingItem}
                        keyExtractor={tastingKeyExtractor}
                        refreshControl={refreshControl}
                        onEndReached={onLoadMoreTastings}
                        onEndReachedThreshold={0.4}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={profileHeader}
                        ListEmptyComponent={
                            <EmptyListView
                                isLoading={isTastingsLoading}
                                image={<EmptyWineListIcon />}
                                text={t('publicProfile.noTastings')}
                                description={t('wine.emptyListDescription')}
                            />
                        }
                        ListFooterComponent={isTastingsLoadingMore ? <ListFooterLoader /> : null}
                    />
                )}
                <PublicProfileLinksModal visible={isLinksModalVisible} items={linkItems} onClose={onHideLinksModal} />
                <WineShareModal
                    visible={isShareModalVisible}
                    onClose={onCloseShareModal}
                    onShareMessengerPress={onShareMessengerPress}
                    onCopyLinkPress={onCopyWineLinkPress}
                />
                <Gallery title="" {...profileGallery} hideHeader hidePreview />
            </ScreenContainer>
        </WithErrorHandler>
    );
});

PublicUserProfileView.displayName = 'PublicUserProfileView';
