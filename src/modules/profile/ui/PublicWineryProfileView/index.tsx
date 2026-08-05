import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, ScrollView, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { IEvent } from '@/entities/events/types/IEvent';
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
import { Typography } from '@/UIKit/Typography';
import { WineShareModal } from '@/UIKit/WineShareModal';
import { Gallery } from '@/UIKit/Gallery';
import { PublicProfileHeader } from '@/modules/profile/ui/components/PublicProfileHeader';
import { PublicProfileTabs } from '@/modules/profile/ui/components/PublicProfileTabs';
import { PublicProfileLinksModal } from '@/modules/profile/ui/components/PublicProfileLinksModal';
import { WineryWineListItem } from '@/modules/profile/ui/components/WineryWineListItem';
import { usePublicWineryProfile } from './presenters/usePublicWineryProfile';
import { getStyles } from './styles';
import { WINE_LIST_PERFORMANCE_PROPS } from '@/UIKit/WineListItem/constants';
import { WineListSearchBar } from '@/modules/profile/ui/components/WineListSearchBar';

export const PublicWineryProfileView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        activeTab,
        tabs,
        events,
        wines,
        linkItems,
        hasLinks,
        profileGallery,
        galleryBadgeText,
        wineryName,
        wineryDetails,
        wineryDescription,
        gallery,
        isWineryVerified,
        wineryStatusLabel,
        mainPhotoUrl,
        isLoading,
        isError,
        isEventsLoading,
        isEventsLoadingMore,
        isWinesLoading,
        isWinesLoadingMore,
        isLinksModalVisible,
        isShareModalVisible,
        winesListRef,
        onPressBack,
        onRefresh,
        onLoadMoreEvents,
        onLoadMoreWines,
        onEventPress,
        onFavoriteEventPress,
        onWinePress,
        onSearchWines,
        scrollWinesToTop,
        onShowLinksModal,
        onHideLinksModal,
        onAvatarPress,
        onOpenShareModal,
        onCloseShareModal,
        onShareMessengerPress,
        onCopyWineLinkPress,
    } = usePublicWineryProfile();
    const { refreshControl } = useRefresh(onRefresh);
    const eventKeyExtractor = useCallback((item: IEvent) => item.id.toString(), []);
    const wineKeyExtractor = useCallback((item: IOfferedWineListItem) => item.id.toString(), []);
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
    const renderWineItem = useCallback<ListRenderItem<IOfferedWineListItem>>(
        ({ item }) => (
            <WineryWineListItem item={item} offer={item.offer} onPress={onWinePress} onSharePress={onOpenShareModal} />
        ),
        [onOpenShareModal, onWinePress],
    );
    const profileHeader = (
        <View>
            <PublicProfileHeader
                name={wineryName}
                avatarUrl={mainPhotoUrl}
                details={wineryDetails}
                statusLabel={wineryStatusLabel}
                isVerified={isWineryVerified}
                galleryBadgeText={galleryBadgeText}
                hasLinks={hasLinks}
                onAvatarPress={onAvatarPress}
                onLinksPress={onShowLinksModal}
            />
            <PublicProfileTabs items={tabs} />
            {activeTab === PublicProfileTab.WINES ? (
                <View style={styles.winesSearch}>
                    <WineListSearchBar onSearch={onSearchWines} scrollToTop={scrollWinesToTop} />
                </View>
            ) : null}
        </View>
    );

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={onRefresh}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton onPressBack={onPressBack} title={t('common.back')} isCentered={false}/>}
            >
                {isLoading && !wineryName ? (
                    <Loader />
                ) : activeTab === PublicProfileTab.DESCRIPTION ? (
                    <ScrollView
                        refreshControl={refreshControl}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.descriptionScrollContent}
                    >
                        {profileHeader}
                        <Gallery
                            title=""
                            {...gallery}
                            hideHeader
                            photoStyle={styles.galleryPhoto}
                            containerStyle={styles.gallery}
                        />
                        <Typography
                            text={wineryDescription || t('publicProfile.noDescription')}
                            variant="body_400"
                            style={styles.description}
                        />
                    </ScrollView>
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
                ) : (
                    <FlatList
                        {...WINE_LIST_PERFORMANCE_PROPS}
                        ref={winesListRef}
                        data={wines}
                        renderItem={renderWineItem}
                        keyExtractor={wineKeyExtractor}
                        refreshControl={refreshControl}
                        onEndReached={onLoadMoreWines}
                        onEndReachedThreshold={0.4}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={profileHeader}
                        ListEmptyComponent={
                            <EmptyListView isLoading={isWinesLoading} text={t('publicProfile.noWines')} />
                        }
                        ListFooterComponent={isWinesLoadingMore ? <ListFooterLoader /> : null}
                    />
                )}
                <PublicProfileLinksModal
                    visible={isLinksModalVisible}
                    items={linkItems}
                    onClose={onHideLinksModal}
                />
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

PublicWineryProfileView.displayName = 'PublicWineryProfileView';
