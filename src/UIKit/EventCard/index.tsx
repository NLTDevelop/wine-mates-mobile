import { useMemo } from 'react';
import { View, Pressable, Image, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { FavoriteButton } from '@/UIKit/FavoriteButton';
import { DateBadge } from '@/UIKit/DateBadge';
import { PartyIcon } from '@assets/icons/PartyIcon';
import { TastingIcon } from '@assets/icons/TastingIcon';
import { MoneyIcon } from '@assets/icons/MoneyIcon';
import { IEvent } from '@/entities/events/types/IEvent';
import { useEventCard } from './presenters/useEventCard';
import { getStyles } from './styles';
import { ISavedEvent } from '@/entities/events/types/ISavedEvent';
import { EditButton } from '../EditButton';
import { ShareIcon } from '@assets/icons/ShareIcon';
import { EventParticipantsPreview } from '@/UIKit/EventParticipantsPreview';
import { QR_CODE_SHARE_SIZE } from '@/utils';

interface IProps {
    event: IEvent | ISavedEvent;
    isSelected: boolean;
    onReadMorePress: (eventId: number) => void;
    onFavoritePress?: (eventId: number) => void;
    onEditPress?: (eventId: number) => void;
    onCardPress?: (eventId: number) => void;
    isModalContent?: boolean;
    showDescription?: boolean;
    showFooter?: boolean;
    appliedEventStatus?: string | null;
}

export const EventCard = ({
    event,
    isSelected,
    onReadMorePress,
    onFavoritePress,
    onEditPress,
    onCardPress,
    isModalContent = false,
    showDescription = true,
    showFooter = true,
    appliedEventStatus = null,
}: IProps) => {
    const { colors, t, locale } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        month,
        day,
        formattedDateTime,
        priceLabel,
        eventTypeLabel,
        isAllSpotsFull,
        eventStatusLabel,
        eventStatusType,
        appliedEventStatusLabel,
        isPartyEvent,
        isCardPressed,
        onCardPress: onCardPressHandler,
        onPressIn,
        onPressOut,
        onReadMorePress: onReadMorePressHandler,
        eventDeepLink,
        onQrCodeRef,
        onShareIconPress,
        onFavoritePress: onFavoritePressHandler,
        onEditPress: onEditPressHandler,
        isEditDisabled,
        isOwner,
        hasMapPreview,
        mapPreviewUri,
        participantsPreviewData,
    } = useEventCard({
        event,
        appliedEventStatus,
        onReadMorePress,
        onFavoritePress,
        onEditPress,
        onCardPress,
        locale,
    });

    const canPressCard = !isModalContent && Boolean(onCardPress);

    return (
        <Pressable
            style={[styles.container, isSelected && styles.selectedContainer, isCardPressed && styles.pressedContainer]}
            onPress={canPressCard ? onCardPressHandler : undefined}
            onPressIn={canPressCard ? onPressIn : undefined}
            onPressOut={canPressCard ? onPressOut : undefined}
            disabled={!canPressCard}
        >
            {isAllSpotsFull && (
                <Typography text={t('event.allSpotsFullMessage')} variant="body_400" style={styles.fullSpotsText} />
            )}

            <View style={styles.metaRow}>
                <View style={styles.metaBadgesRow}>
                    <View style={styles.metaBadge}>
                        {isPartyEvent ? <PartyIcon width={20} height={20} /> : <TastingIcon width={20} height={20} />}
                        <Typography text={eventTypeLabel} variant="body_400" style={styles.metaText} />
                    </View>
                    <View style={styles.metaBadge}>
                        <MoneyIcon width={20} height={20} />
                        <Typography text={priceLabel} variant="body_400" style={styles.metaText} />
                    </View>
                </View>
                <TouchableOpacity style={styles.shareButton} onPress={onShareIconPress}>
                    <ShareIcon />
                </TouchableOpacity>
            </View>

            {eventStatusType || appliedEventStatus ? (
                <View style={styles.statusRow}>
                    {eventStatusType && (
                        <View
                            style={
                                eventStatusType === 'finished'
                                    ? styles.eventStatusFinished
                                    : styles.eventStatusCanceled
                            }
                        >
                            <Typography text={eventStatusLabel} variant="body_400" style={styles.statusText} />
                        </View>
                    )}
                    {appliedEventStatus && (
                        <View
                            style={[
                                styles.appliedStatusContainer,
                                appliedEventStatus === 'pending'
                                    ? styles.appliedEventStatusPending
                                    : appliedEventStatus === 'rejected'
                                      ? styles.appliedEventStatusRejected
                                      : appliedEventStatus === 'canceled'
                                        ? styles.appliedEventStatusCanceled
                                        : styles.appliedEventStatusConfirmed,
                            ]}
                        >
                            <Typography text={appliedEventStatusLabel} variant="body_400" style={styles.statusText} />
                        </View>
                    )}
                </View>
            ) : null}

            <View style={styles.hiddenQrCodeContainer}>
                <QRCode value={eventDeepLink} getRef={onQrCodeRef} size={QR_CODE_SHARE_SIZE} />
            </View>

            <View style={styles.header}>
                <DateBadge month={month} day={day} />

                <View style={styles.headerContent}>
                    <Typography text={event.theme} variant="h4" style={styles.title} />
                    <Typography text={formattedDateTime} variant="body_400" style={styles.timeText} />
                </View>
            </View>
            <EventParticipantsPreview data={participantsPreviewData} />
            {showDescription && (
                <Typography
                    text={event.description}
                    variant="body_400"
                    numberOfLines={isModalContent ? undefined : 2}
                    style={styles.descriptionText}
                />
            )}

            {hasMapPreview && (
                <View style={styles.mapContainer}>
                    <Image source={{ uri: mapPreviewUri }} style={styles.map} resizeMode="cover" />
                </View>
            )}

            {showFooter && (
                <View style={styles.footer}>
                    <Button
                        type="main"
                        containerStyle={styles.readMoreButton}
                        text={t('eventMap.readMore')}
                        onPress={onReadMorePressHandler}
                    />
                    {isOwner ? (
                        <EditButton onPress={onEditPressHandler} size={48} disabled={isEditDisabled} />
                    ) : (
                        <FavoriteButton onPress={onFavoritePressHandler} size={48} isSaved={Boolean(event.isSaved)} />
                    )}
                </View>
            )}
        </Pressable>
    );
};
