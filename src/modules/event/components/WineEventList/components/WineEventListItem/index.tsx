import { useCallback, useMemo } from 'react';
import { View, Image } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles.ts';
import { IEvent } from '@/entities/events/types/IEvent';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { formatEventDate } from '@/utils';
import { Button } from '@/UIKit/Button';
import { FavoriteButton } from '@/UIKit/FavoriteButton';
import { DateBadge } from '@/UIKit/DateBadge';

interface IWineEventListItemProps {
    event: IEvent;
    isSelected: boolean;
    onReadMorePress: (eventId: number) => void;
    onFavoritePress?: (eventId: number) => void;
    eventId: number;
}

export const WineEventListItem = ({
    event,
    isSelected,
    onReadMorePress,
    onFavoritePress,
    eventId
}: IWineEventListItemProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { month, day } = formatEventDate(event.date);

    const handleFavoritePress = () => {
        onFavoritePress?.(eventId);
    };

    const handleReadMorePress = useCallback(() => {
        onReadMorePress?.(eventId);
    }, [eventId, onReadMorePress])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <DateBadge month={month} day={day} />

                <View style={styles.headerContent}>
                    <Typography text={event.title} variant="h5" style={styles.title} />

                    <View style={styles.attendeesRow}>
                        <View style={styles.avatarsContainer}>
                            {event.attendees?.slice(0, 3).map((avatar, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: avatar }}
                                    style={[styles.avatar, index > 0 && styles.avatarOverlap]}
                                />
                            ))}
                        </View>
                        <Typography
                            text={`+${event.attendeesCount} Going`}
                            variant="subtitle_12_400"
                            style={styles.attendeesText}
                        />
                    </View>

                    <Typography
                        text={`${event.date} · ${event.startTime} - ${event.endTime}`}
                        variant="subtitle_12_400"
                        style={styles.timeText}
                    />

                    <View style={styles.badgesRow}>
                        <View style={styles.badge}>
                            <Typography text="🍷" variant="h5" />
                            <Typography
                                text={`${event.eventType === 'offline' ? 'Offline' : 'Online'} Event`}
                                variant="body_400"
                                style={styles.badgeText}
                            />
                        </View>
                        <View style={styles.badge}>
                            <Typography text="💵" variant="h5" />
                            <Typography
                                text={`€${(event.price)}`}
                                variant="body_400"
                                style={styles.badgeText}
                            />
                        </View>
                    </View>
                </View>
            </View>

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
                >
                    <Marker
                        coordinate={{ latitude: event.latitude, longitude: event.longitude }}
                    />
                </MapView>
            </View>

            <View style={styles.footer}>
                <Button type="main" containerStyle={styles.readMoreButton} text={t('eventMap.readMore')} onPress={handleReadMorePress} />
                <FavoriteButton onPress={handleFavoritePress} size={52} />
            </View>
        </View>
    );
};
