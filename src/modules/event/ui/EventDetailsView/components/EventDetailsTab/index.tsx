import { useMemo } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, ScrollView, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { Button } from '@/UIKit/Button';
import { FavoriteButton } from '@/UIKit/FavoriteButton';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { IWineSetItem } from '@/entities/events/types/IWineSetItem';
import { WineSetItem } from '../WineSetItem';
import { EventDetailsPreview } from '../EventDetailsPreview';
import { getStyles } from './styles';
import { useEventDetailsTab } from './presenters/useEventDetailsTab';

interface IProps {
    eventId: number;
}

export const EventDetailsTab = ({ eventId }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        isLoading,
        isError,
        eventDetail,
        detailsData,
        wineSetItems,
        cardPreviewData,
        isBookingModalVisible,
        onBookNowPress,
        onCloseModal,
        onFavoritePress,
        onCallToReservePress,
    } = useEventDetailsTab({ eventId });

    const keyExtractor = (item: IWineSetItem) => `${item.id}`;

    const renderWineSetItem: ListRenderItem<IWineSetItem> = function renderWineSetItem({ item }) {
        return <WineSetItem item={item} />;
    };

    const renderWineSetItemSeparator = function renderWineSetItemSeparator() {
        return <View style={styles.wineSetItemSeparator} />;
    };

    if (isLoading) {
        return (
            <View style={styles.stateContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!eventDetail) {
        return (
            <View style={styles.stateContainer}>
                <EmptyListView isNothingFound={isError} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                {cardPreviewData && <EventDetailsPreview data={cardPreviewData} />}

                <View style={styles.card}>
                    {detailsData.map((item, index) => (
                        <View key={item.key}>
                            <View>
                                <Typography text={`${item.label}:`} variant="h6" style={styles.label} />
                                <Typography text={item.value} variant="h6" style={styles.value} />
                            </View>
                            {index < detailsData.length - 1 && <View style={styles.rowDivider} />}
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
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    type="main"
                    containerStyle={styles.bookNowButton}
                    text={t('eventDetails.bookNow')}
                    onPress={onBookNowPress}
                />
                <FavoriteButton onPress={onFavoritePress} size={52} />
            </View>

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
    );
};
