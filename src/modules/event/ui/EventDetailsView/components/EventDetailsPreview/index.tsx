import { useMemo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { DateBadge } from '@/UIKit/DateBadge';
import { PartyIcon } from '@assets/icons/PartyIcon';
import { TastingIcon } from '@assets/icons/TastingIcon';
import { MoneyIcon } from '@assets/icons/MoneyIcon';
import { ShareIcon } from '@assets/icons/ShareIcon';
import { IEventDetailsPreviewData } from '../../types/IEventDetailsPreviewData';
import { getStyles } from './styles';
import { useEventDetailsPreview } from './presenters/useEventDetailsPreview';
import { EventParticipantsPreview } from '@/UIKit/EventParticipantsPreview';

interface IProps {
    data: IEventDetailsPreviewData;
    eventId: number;
}

export const EventDetailsPreview = ({ data, eventId }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { eventDeepLink, onQrCodeRef, onShareIconPress } = useEventDetailsPreview({ eventId });

    return (
        <View style={styles.container}>
            <View style={styles.metaRow}>
                <View style={styles.metaBadgesRow}>
                    <View style={styles.metaBadge}>
                        {data.isPartyEvent ? (
                            <PartyIcon width={20} height={20} />
                        ) : (
                            <TastingIcon width={20} height={20} />
                        )}
                        <Typography text={data.eventTypeLabel} variant="body_400" style={styles.metaText} />
                    </View>
                    <View style={styles.metaBadge}>
                        <MoneyIcon width={20} height={20} />
                        <Typography text={data.priceLabel} variant="body_400" style={styles.metaText} />
                    </View>
                </View>
                <TouchableOpacity style={styles.shareButton} onPress={onShareIconPress}>
                    <ShareIcon />
                </TouchableOpacity>
            </View>

            <View style={styles.header}>
                <DateBadge month={data.month} day={data.day} />
                <View style={styles.headerContent}>
                    <Typography text={data.title} variant="h4" style={styles.title} />
                    <Typography text={data.formattedDateTime} variant="body_400" style={styles.timeText} />
                </View>
            </View>
            <EventParticipantsPreview data={data.participantsPreviewData} />
            <View style={styles.mapContainer}>
                <Image source={{ uri: data.mapPreviewUri }} style={styles.map} resizeMode="cover" />
            </View>

            <View style={styles.hiddenQrCodeContainer}>
                <QRCode value={eventDeepLink} getRef={onQrCodeRef} size={1} />
            </View>
        </View>
    );
};
