import { useMemo } from 'react';
import { Image, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { DateBadge } from '@/UIKit/DateBadge';
import { PartyIcon } from '@assets/icons/PartyIcon';
import { TastingIcon } from '@assets/icons/TastingIcon';
import { MoneyIcon } from '@assets/icons/MoneyIcon';
import { IEventDetailsPreviewData } from '../../types/IEventDetailsPreviewData';
import { getStyles } from './styles';

interface IProps {
    data: IEventDetailsPreviewData;
}

export const EventDetailsPreview = ({ data }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <View style={styles.metaRow}>
                <View style={styles.metaBadge}>
                    {data.isPartyEvent ? <PartyIcon width={20} height={20} /> : <TastingIcon width={20} height={20} />}
                    <Typography text={data.eventTypeLabel} variant="body_400" style={styles.metaText} />
                </View>
                <View style={styles.metaBadge}>
                    <MoneyIcon width={20} height={20} />
                    <Typography text={data.priceLabel} variant="body_400" style={styles.metaText} />
                </View>
            </View>

            <View style={styles.header}>
                <DateBadge month={data.month} day={data.day} />
                <View style={styles.headerContent}>
                    <Typography text={data.title} variant="h4" style={styles.title} />
                    <Typography text={data.formattedDateTime} variant="body_400" style={styles.timeText} />
                </View>
            </View>

            <View style={styles.mapContainer}>
                <Image source={{ uri: data.mapPreviewUri }} style={styles.map} resizeMode="cover" />
            </View>
        </View>
    );
};
