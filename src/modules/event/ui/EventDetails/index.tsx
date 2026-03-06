import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { TitledContent } from '@/UIKit/TitledContent';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { Button } from '@/UIKit/Button';
import { FavoriteButton } from '@/UIKit/FavoriteButton';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { getStyles } from './styles';
import { useEventDetails } from '@/modules/event/ui/EventDetails/presenters/useEventDetails';
import { useEventDetailsData } from '@/modules/event/ui/EventDetails/presenters/useEventDetailsData';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { RoundedButton } from '@/UIKit/TitledContent/components/RoundedButton';
import { observer } from 'mobx-react';
import { Collapse } from '@/UIKit/Collapse';

export const EventDetails = observer(() => {
    const { colors, t } = useUiContext();
    const route = useRoute<RouteProp<EventStackParamList, 'EventDetails'>>();
    const {goBack} = useNavigation();

    const { eventId } = route.params;
    const { eventDetail, isError } = useEventDetails(eventId);
    const { detailsData, maxLabelWidth, handleLabelLayout } = useEventDetailsData(eventDetail);
    const [isBookingModalVisible, setIsBookingModalVisible] = React.useState(false);

    const styles = useMemo(() => getStyles(colors, maxLabelWidth), [colors, maxLabelWidth]);

    const handleBookNowPress = () => {
        setIsBookingModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsBookingModalVisible(false);
    };

    return (
        <ScreenContainer edges={[]} scrollEnabled={false} containerStyle={styles.container} >
            <TitledContent title={t('eventDetails.title')} leftComponent={<RoundedButton isArrowLeft onPress={goBack} />} titleVariant="h3">
                {
                    !eventDetail ?
                        <EmptyListView isLoading={!isError} isNothingFound={isError} /> :
                        <ScrollView contentContainerStyle={styles.content}>
                            <View style={styles.card}>
                                {detailsData.map((item) => (
                                    <View key={item.key} style={styles.row}>
                                        <View style={styles.labelContainer}>
                                            <Typography
                                                text={`${item.label}:`}
                                                variant="body_400"
                                                style={styles.label}
                                                onLayout={(e) => handleLabelLayout(e.nativeEvent.layout.width)}
                                            />
                                        </View>
                                        <View style={styles.valueContainer}>
                                            <Typography
                                                text={item.value}
                                                variant="body_500"
                                                style={styles.value}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>

                            {eventDetail.wineSet && eventDetail.wineSet.length > 0 && (
                                <Collapse title={t('eventDetails.wineSet')}>
                                    <View style={styles.wineSetContainer}>
                                        {eventDetail.wineSet.map((wine, index) => (
                                            <Typography
                                                key={index}
                                                text={`🍷 ${wine}`}
                                                variant="body_400"
                                                style={styles.wineSetText}
                                            />
                                        ))}
                                    </View>
                                </Collapse>
                            )}
                        </ScrollView>
                }
            </TitledContent>
            <View style={styles.footer}>
                <Button type="main" containerStyle={styles.bookNowButton} text={t('eventDetails.bookNow')} onPress={handleBookNowPress} />
                <FavoriteButton onPress={() => {}} size={52} />
            </View>

            <BottomModal
                visible={isBookingModalVisible}
                onClose={handleCloseModal}
                title={t('eventDetails.contactForBooking')}
            >
                <View>
                    <Button
                        type="main"
                        text={t('eventDetails.callToReserve')}
                        onPress={() => {}}
                    />
                </View>
            </BottomModal>
        </ScreenContainer>
    );
});
