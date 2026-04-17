import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
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
import { DropdownButton } from '@/UIKit/DropdownButton';

export const EventDetailsView = observer(() => {
    const { colors, t } = useUiContext();
    const route = useRoute<RouteProp<EventStackParamList, 'EventDetailsView'>>();

    const { eventId } = route.params;
    const { eventDetail, isError, isLoading } = useEventDetails(eventId);
    const { detailsData, wineSetItems } = useEventDetailsData(eventDetail);
    const { isBookingModalVisible, onBookNowPress, onCloseModal } = useEventDetailsView();

    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <ScreenContainer
            edges={['top']}
            scrollEnabled
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
                                <DropdownButton title={t('eventDetails.wineSet')}>
                                    <View style={styles.wineSetListContainer}>
                                        {wineSetItems.map((wine, index) => (
                                            <Typography
                                                key={index}
                                                text={`🍷 ${wine}`}
                                                variant="body_400"
                                                style={styles.wineSetText}
                                            />
                                        ))}
                                    </View>
                                </DropdownButton>
                            )}
                        </View>
                        <View style={styles.footer}>
                            <Button
                                type="main"
                                containerStyle={styles.bookNowButton}
                                text={t('eventDetails.bookNow')}
                                onPress={onBookNowPress}
                            />
                            <FavoriteButton onPress={() => {}} size={52} />
                        </View>
                    </>
                )}

                <BottomModal
                    visible={isBookingModalVisible}
                    onClose={onCloseModal}
                    title={t('eventDetails.contactForBooking')}
                >
                    <View>
                        <Button type="main" text={t('eventDetails.callToReserve')} onPress={() => {}} />
                    </View>
                </BottomModal>
            </View>
        </ScreenContainer>
    );
});
