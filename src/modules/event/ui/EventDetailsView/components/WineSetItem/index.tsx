import { useMemo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { getStyles } from './styles';
import { useWineSetItem } from './presenters/useWineSetItem';
import { IWineSetItem } from '@/entities/events/types/IWineSetItem';

interface IProps {
    eventId: number;
    item: IWineSetItem;
    isBlindTasting?: boolean;
    wineOrder?: number;
    isOwner: boolean;
    isPressEnabled: boolean;
    isStatusVisible: boolean;
    hasEventEnded: boolean;
}

export const WineSetItem = ({
    eventId,
    item,
    isBlindTasting = false,
    wineOrder = 1,
    isPressEnabled,
    isStatusVisible,
    hasEventEnded,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { title, imageUrl, isImageVisible, statusBadgeData, onPress } = useWineSetItem({
        eventId,
        item,
        isBlindTasting,
        wineOrder,
        isPressEnabled,
        isStatusVisible,
        hasEventEnded,
        t,
    });

    const statusBadgeStyle = statusBadgeData ? styles[`${statusBadgeData.type}Badge`] : null;
    const statusBadgeTextStyle = statusBadgeData ? styles[`${statusBadgeData.type}BadgeText`] : null;

    return (
        <TouchableOpacity style={styles.row} onPress={onPress} disabled={!isPressEnabled}>
            <View style={styles.leftContent}>
                {isImageVisible &&
                    (imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    ) : (
                        <View style={styles.image} />
                    ))}
                <Typography text={title} variant="body_400" style={styles.title} numberOfLines={2} />
            </View>
            {statusBadgeData && (
                <View style={[styles.statusBadge, statusBadgeStyle]}>
                    <Typography text={statusBadgeData.label} variant="subtitle_12_500" style={statusBadgeTextStyle} />
                </View>
            )}
            {isPressEnabled && <ArrowDownIcon rotate={270} color={colors.text_light} width={20} height={20} />}
        </TouchableOpacity>
    );
};
