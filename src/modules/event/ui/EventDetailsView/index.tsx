import { useMemo } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
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

export const EventDetailsView = observer(() => {
    const { colors, t } = useUiContext();
    const route = useRoute<RouteProp<EventStackParamList, 'EventDetailsView'>>();

    const { eventId } = route.params;
    const { eventDetail, isError, isLoading } = useEventDetails(eventId);
    const { detailsData, wineSetItems, cardPreviewData } = useEventDetailsData(eventDetail);
    const {
        isBookingModalVisible,
        onBookNowPress,
        onCloseModal,
        onFavoritePress,
        onCallToReservePress,
    } = useEventDetailsView();

    const styles = useMemo(() => getStyles(colors), [colors]);
    const keyExtractor = (item: IWineSetItem) => `${item.id}`;

    const renderWineSetItem: ListRenderItem<IWineSetItem> = function renderWineSetItem({ item }) {
        return <WineSetItem item={item} />;
    };

    const renderWineSetItemSeparator = function renderWineSetItemSeparator() {
        return <View style={styles.wineSetItemSeparator} />;
    };

    return (
        <ScreenContainer
            edges={['top']}
            scrollEnabled
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
                        <View style={styles.content}>
                            {cardPreviewData && (
                                <EventDetailsPreview data={cardPreviewData} />
                            )}

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
                        <View style={styles.footer}>
                            <Button
                                type="main"
                                containerStyle={styles.bookNowButton}
                                text={t('eventDetails.bookNow')}
                                onPress={onBookNowPress}
                            />
                            <FavoriteButton onPress={onFavoritePress} size={52} />
                        </View>
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
