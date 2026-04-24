import { useMemo } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, ScrollView, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NavigationState, SceneRendererProps, TabView } from 'react-native-tab-view';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { Button } from '@/UIKit/Button';
import { FavoriteButton } from '@/UIKit/FavoriteButton';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { getStyles } from './styles';
import { useEventDetails } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetails';
import { useEventDetailsData } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetailsData';
import { useEventDetailsView } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetailsView';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { observer } from 'mobx-react';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { IWineSetItem } from '@/entities/events/types/IWineSetItem';
import { WineSetItem } from './components/WineSetItem';
import { EventDetailsPreview } from './components/EventDetailsPreview';
import { TabsBar } from './components/TabsBar';
import { size } from '@/utils';

interface IRoute {
    key: 'eventDetails' | 'guests';
    title: string;
}

interface ISceneProps {
    route: IRoute;
}

export const EventDetailsView = observer(() => {
    const { colors, t } = useUiContext();
    const route = useRoute<RouteProp<EventStackParamList, 'EventDetailsView'>>();

    const { eventId } = route.params;
    const { eventDetail, isError, isLoading } = useEventDetails(eventId);
    const { detailsData, wineSetItems, cardPreviewData } = useEventDetailsData(eventDetail);
    const {
        screenIndex,
        routes,
        isEventDetailsTab,
        isBookingModalVisible,
        onBookNowPress,
        onCloseModal,
        onFavoritePress,
        onCallToReservePress,
        onIndexChange,
    } = useEventDetailsView({ t });

    const styles = useMemo(() => getStyles(colors), [colors]);
    const keyExtractor = (item: IWineSetItem) => `${item.id}`;

    const renderWineSetItem: ListRenderItem<IWineSetItem> = function renderWineSetItem({ item }) {
        return <WineSetItem item={item} />;
    };

    const renderWineSetItemSeparator = function renderWineSetItemSeparator() {
        return <View style={styles.wineSetItemSeparator} />;
    };

    const renderEventDetailsTab = function renderEventDetailsTab() {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.eventDetailsTabContentContainer}
            >
                <View style={styles.content}>
                    {cardPreviewData && <EventDetailsPreview data={cardPreviewData} />}

                    <View style={styles.card}>
                        {detailsData.map(item => (
                            <View key={item.key} style={styles.row}>
                                <View style={styles.labelContainer}>
                                    <Typography text={`${item.label}:`} variant="h6" style={styles.label} />
                                </View>
                                <View style={styles.valueContainer}>
                                    <Typography text={item.value} variant="h6" style={styles.value} />
                                </View>
                            </View>
                        ))}
                    </View>

                    {wineSetItems.length > 0 && (
                        <View style={styles.wineSetListContainer}>
                            <FlatList
                                data={wineSetItems}
                                keyExtractor={keyExtractor}
                                renderItem={renderWineSetItem}
                                scrollEnabled={false}
                                ItemSeparatorComponent={renderWineSetItemSeparator}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        );
    };

    const renderGuestsTab = function renderGuestsTab() {
        return (
            <View style={styles.guestsContainer}>
                <Typography text="-" variant="h5" style={styles.guestsText} />
            </View>
        );
    };

    const renderScene = function renderScene({ route: sceneRoute }: ISceneProps) {
        if (sceneRoute.key === 'eventDetails') {
            return renderEventDetailsTab();
        }

        return renderGuestsTab();
    };

    const renderTabBar = function renderTabBar(props: SceneRendererProps & { navigationState: NavigationState<IRoute> }) {
        return <TabsBar tabBarProps={props} onIndexChange={onIndexChange} />;
    };

    return (
        <ScreenContainer
            edges={['top']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('eventDetails.title')} />}
        >
            <View style={styles.container}>
                {isLoading ? (
                    <View style={styles.stateContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : !eventDetail ? (
                    <View style={styles.stateContainer}>
                        <EmptyListView isNothingFound={isError} />
                    </View>
                ) : (
                    <>
                        <View style={styles.tabViewContainer}>
                            <TabView
                                lazy
                                swipeEnabled
                                renderTabBar={renderTabBar}
                                navigationState={{ index: screenIndex, routes }}
                                renderScene={renderScene}
                                onIndexChange={onIndexChange}
                                initialLayout={{ width: size.width }}
                            />
                        </View>

                        {isEventDetailsTab && (
                            <View style={styles.footer}>
                                <Button
                                    type="main"
                                    containerStyle={styles.bookNowButton}
                                    text={t('eventDetails.bookNow')}
                                    onPress={onBookNowPress}
                                />
                                <FavoriteButton onPress={onFavoritePress} size={52} />
                            </View>
                        )}
                    </>
                )}

                <BottomModal
                    visible={isBookingModalVisible}
                    onClose={onCloseModal}
                    title={t('eventDetails.contactForBooking')}
                >
                    <View>
                        <Button type="main" text={t('eventDetails.callToReserve')} onPress={onCallToReservePress} />
                    </View>
                </BottomModal>
            </View>
        </ScreenContainer>
    );
});
