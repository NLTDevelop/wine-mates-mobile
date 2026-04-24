import { useMemo } from 'react';
import { View, Pressable, Image } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { FavoriteButton } from '@/UIKit/FavoriteButton';
import { DateBadge } from '@/UIKit/DateBadge';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { PartyIcon } from '@assets/icons/PartyIcon';
import { TastingIcon } from '@assets/icons/TastingIcon';
import { MoneyIcon } from '@assets/icons/MoneyIcon';
import { IEvent } from '@/entities/events/types/IEvent';
import { useEventCard } from './presenters/useEventCard';
import { getStyles } from './styles';

interface IProps {
    event: IEvent;
    isSelected: boolean;
    onReadMorePress: (eventId: number) => void;
    onFavoritePress?: (eventId: number) => void;
    isModalContent?: boolean;
    showDescription?: boolean;
    showFooter?: boolean;
}

export const EventCard = ({
    event,
    isSelected,
    onReadMorePress,
    onFavoritePress,
    isModalContent = false,
    showDescription = true,
    showFooter = true,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        month,
        day,
        formattedDateTime,
        priceLabel,
        eventTypeLabel,
        isPartyEvent,
        isModalVisible,
        isCardPressed,
        onCardPress,
        onPressIn,
        onPressOut,
        onCloseModal,
        onReadMorePress: onReadMorePressHandler,
        onReadMoreFromModalContent,
        onFavoritePress: onFavoritePressHandler,
        mapPreviewUri,
    } = useEventCard({
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
                    {isPartyEvent ? <PartyIcon width={20} height={20} /> : <TastingIcon width={20} height={20} />}
                    <Typography text={eventTypeLabel} variant="body_400" style={styles.metaText} />
                </View>
                <View style={styles.metaBadge}>
                    <MoneyIcon width={20} height={20} />
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

            {showDescription && (
                <Typography
                    text={event.description}
                    variant="body_400"
                    numberOfLines={isModalContent ? undefined : 2}
                    style={styles.descriptionText}
                />
            )}

            <View style={styles.mapContainer}>
                <Image
                    source={{ uri: mapPreviewUri }}
                    style={styles.map}
                    resizeMode="cover"
                />
            </View>

            {showFooter && (
                <View style={styles.footer}>
                    <Button type="main" containerStyle={styles.readMoreButton} text={t('eventMap.readMore')} onPress={onReadMorePressHandler} />
                    <FavoriteButton onPress={onFavoritePressHandler} size={56} />
                </View>
            )}

            {!isModalContent && (
                <BottomModal
                    visible={isModalVisible}
                    onClose={onCloseModal}
                    title={t('eventDetails.title')}
                    contentContainerStyle={styles.modalContentContainer}
                >
                    <EventCard
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
