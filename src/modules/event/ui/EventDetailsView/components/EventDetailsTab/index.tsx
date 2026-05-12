import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, ScrollView, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { Button } from '@/UIKit/Button';
import { FavoriteButton } from '@/UIKit/FavoriteButton';
import { EditButton } from '@/UIKit/EditButton';
import { IWineSetItem } from '@/entities/events/types/IWineSetItem';
import { IEventContactOption } from '@/modules/event/ui/EventDetailsView/types/IEventContactOption';
import { WineSetItem } from '../WineSetItem';
import { EventContactItem } from '../EventContactItem';
import { EventDetailsPreview } from '../EventDetailsPreview';
import { EventPaymentMethodsModal } from '../EventPaymentMethodsModal';
import { EventSelectedPaymentMethodModal } from '../EventSelectedPaymentMethodModal';
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
        contactItems,
        cardPreviewData,
        onBookNowPress,
        onCancelEventPress,
        onFavoritePress,
        onEditPress,
        onDuplicatePress,
        isOwner,
        isBookNowDisabled,
        isCancelEventDisabled,
        isBookNowInProgress,
        isEventApplied,
        isPaymentMethodsModalVisible,
        paymentMethodOptions,
        isPaymentMethodNextDisabled,
        onClosePaymentMethodsModal,
        onNextPaymentMethodPress,
        isSelectedPaymentMethodModalVisible,
        selectedPaymentMethod,
        onCloseSelectedPaymentMethodModal,
    } = useEventDetailsTab({ eventId });

    const keyExtractor = useCallback((item: IWineSetItem) => `${item.id}`, []);

    const renderWineSetItem: ListRenderItem<IWineSetItem> = useCallback(({ item }) => {
        return <WineSetItem item={item} />;
    }, []);

    const renderWineSetItemSeparator = useCallback(() => {
        return <View style={styles.wineSetItemSeparator} />;
    }, [styles.wineSetItemSeparator]);

    const contactKeyExtractor = useCallback((item: IEventContactOption) => `${item.id}`, []);

    const renderContactItem: ListRenderItem<IEventContactOption> = useCallback(({ item }) => {
        return <EventContactItem item={item} />;
    }, []);

    const renderContactItemSeparator = useCallback(() => {
        return <View style={styles.contactItemSeparator} />;
    }, [styles.contactItemSeparator]);

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
                {cardPreviewData && <EventDetailsPreview data={cardPreviewData} eventId={eventId} />}

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

                {contactItems.length > 0 && (
                    <View style={styles.contactsSection}>
                        <Typography text={t('contactInfo.contacts')} variant="h5" style={styles.contactsTitle} />
                        <FlatList
                            data={contactItems}
                            keyExtractor={contactKeyExtractor}
                            renderItem={renderContactItem}
                            scrollEnabled={false}
                            ItemSeparatorComponent={renderContactItemSeparator}
                        />
                    </View>
                )}

                <View style={styles.footer}>
                    {isOwner ? (
                        <>
                            <View style={styles.footerRow}>
                                <Button
                                    type="secondary"
                                    containerStyle={styles.bookNowButton}
                                    text={t('eventDetails.duplicate')}
                                    onPress={onDuplicatePress}
                                />
                                <EditButton onPress={onEditPress} size={48} disabled={isCancelEventDisabled} />
                            </View>
                            <Button
                                type="main"
                                containerStyle={styles.bookNowButton}
                                text={t('eventDetails.cancel')}
                                onPress={onCancelEventPress}
                                disabled={isCancelEventDisabled}
                                inProgress={isBookNowInProgress}
                            />
                        </>
                    ) : (
                        <View style={styles.footerRow}>
                            <Button
                                type="main"
                                containerStyle={styles.bookNowButton}
                                text={isEventApplied ? t('eventDetails.booked') : t('eventDetails.bookNow')}
                                onPress={onBookNowPress}
                                disabled={isBookNowDisabled || isBookNowInProgress}
                                inProgress={isBookNowInProgress}
                            />
                            <FavoriteButton
                                onPress={onFavoritePress}
                                size={48}
                                isSaved={Boolean(eventDetail.isSaved)}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
            {isPaymentMethodsModalVisible && (
                <EventPaymentMethodsModal
                    visible={isPaymentMethodsModalVisible}
                    options={paymentMethodOptions}
                    isNextDisabled={isPaymentMethodNextDisabled}
                    onClose={onClosePaymentMethodsModal}
                    onNextPress={onNextPaymentMethodPress}
                />
            )}
            {isSelectedPaymentMethodModalVisible && (
                <EventSelectedPaymentMethodModal
                    visible={isSelectedPaymentMethodModalVisible}
                    paymentMethod={selectedPaymentMethod}
                    onClose={onCloseSelectedPaymentMethodModal}
                />
            )}
        </View>
    );
};
