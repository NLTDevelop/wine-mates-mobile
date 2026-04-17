import { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { FavoriteButton } from '@/UIKit/FavoriteButton';
import { DateBadge } from '@/UIKit/DateBadge';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { MapMarker } from '@/UIKit/MapMarker';
import { IEvent } from '@/entities/events/types/IEvent';
import { useWineEventListItem } from './presenters/useWineEventListItem';
import { getStyles } from './styles';

interface IProps {
    event: IEvent;
    isSelected: boolean;
    onReadMorePress: (eventId: number) => void;
    onFavoritePress?: (eventId: number) => void;
    isModalContent?: boolean;
}

export const WineEventListItem = ({
    event,
    isSelected,
    onReadMorePress,
    onFavoritePress,
    isModalContent = false,
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
        isCardPressed,
        onCardPress,
        onPressIn,
        onPressOut,
        onCloseModal,
        onReadMorePress: onReadMorePressHandler,
        onReadMoreFromModalContent,
        onFavoritePress: onFavoritePressHandler
    } = useWineEventListItem({
        event,
        onReadMorePress,
        onFavoritePress
    });


    return (
        <Pressable
            style={[styles.container, isSelected && styles.selectedContainer, isCardPressed && styles.pressedContainer]}
            onPress={isModalContent ? undefined : onCardPress}
            onPressIn={isModalContent ? undefined : onPressIn}
            onPressOut={isModalContent ? undefined : onPressOut}
            disabled={isModalContent}
        >
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

            <Typography
                text={event.description}
                variant="body_400"
                numberOfLines={isModalContent ? undefined : 2}
                style={styles.descriptionText}
            />

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
                        eventType={event.eventType}
                    />
                </MapView>
            </View>

            <View style={styles.footer}>
                <Button type="main" containerStyle={styles.readMoreButton} text={t('eventMap.readMore')} onPress={onReadMorePressHandler} />
                <FavoriteButton onPress={onFavoritePressHandler} size={56} />
            </View>

            {!isModalContent && (
                <BottomModal
                    visible={isModalVisible}
                    onClose={onCloseModal}
                    title={t('eventDetails.title')}
                    contentContainerStyle={styles.modalContentContainer}
                >
                    <WineEventListItem
                        event={event}
                        isSelected={false}
                        onReadMorePress={onReadMoreFromModalContent}
                        onFavoritePress={onFavoritePress}
                        isModalContent
                    />
                </BottomModal>
            )}
        </Pressable>
    );
};
