import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { FavoriteButton } from '@/UIKit/FavoriteButton';
import { DateBadge } from '@/UIKit/DateBadge';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { MapMarker } from '@/UIKit/MapMarker';
import { EventModalCard } from '@/modules/event/components/EventModalCard';
import { IEvent } from '@/entities/events/types/IEvent';
import { useWineEventListItem } from './presenters/useWineEventListItem';
import { getStyles } from './styles';

interface IProps {
    event: IEvent;
    isSelected: boolean;
    onReadMorePress: (eventId: number) => void;
    onFavoritePress?: (eventId: number) => void;
}

export const WineEventListItem = ({
    event,
    onReadMorePress,
    onFavoritePress
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        month,
        day,
        formattedDateTime,
        priceLabel,
        eventTypeLabel,
        isModalVisible,
        onCardPress,
        onBookingPress,
        onCloseModal,
        onReadMorePress: onReadMorePressHandler,
        onFavoritePress: onFavoritePressHandler
    } = useWineEventListItem({
        event,
        onReadMorePress,
        onFavoritePress
    });


    return (
        <TouchableOpacity style={styles.container} onPress={onCardPress} activeOpacity={0.7}>
            <View style={styles.metaRow}>
                <View style={styles.metaBadge}>
                    <Typography text="🍷" variant="h5" />
                    <Typography text={eventTypeLabel} variant="body_400" style={styles.metaText} />
                </View>
                <View style={styles.metaBadge}>
                    <Typography text="💵" variant="h5" />
                    <Typography text={priceLabel} variant="body_400" style={styles.metaText} />
                </View>
            </View>

            <View style={styles.header}>
                <DateBadge month={month} day={day} />

                <View style={styles.headerContent}>
                    <Typography text={event.theme} variant="h4" style={styles.title} />
                    <Typography text={formattedDateTime} variant="body_400" style={styles.timeText} />
                </View>
            </View>

            <Typography text={event.description} variant="body_400" numberOfLines={2} style={styles.descriptionText} />

            <View style={styles.mapContainer}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: event.latitude,
                        longitude: event.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    toolbarEnabled={false}
                >
                    <MapMarker
                        markerProps={{
                            coordinate: { latitude: event.latitude, longitude: event.longitude }
                        }}
                        eventId={event.id}
                        tastingType={event.tastingType}
                    />
                </MapView>
            </View>

            <View style={styles.footer}>
                <Button type="main" containerStyle={styles.readMoreButton} text={t('eventMap.readMore')} onPress={onReadMorePressHandler} />
                <FavoriteButton onPress={onFavoritePressHandler} size={56} />
            </View>

            <BottomModal
                visible={isModalVisible}
                onClose={onCloseModal}
            >
                <EventModalCard
                    event={event}
                    onBookingPress={onBookingPress}
                    onFavoritePress={onFavoritePressHandler}
                />
            </BottomModal>
        </TouchableOpacity>
    );
};
