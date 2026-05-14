import { useCallback } from 'react';
import { IWineSetItem, WineSetTastingStatus } from '@/entities/events/types/IWineSetItem';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type WineSetStatusBadgeType = 'notStarted' | 'inProgress' | 'tasted' | 'missed';
type TTranslate = (key: string, options?: Record<string, unknown>) => string;

interface IUseWineSetItemProps {
    eventId: number;
    item: IWineSetItem;
    isBlindTasting: boolean;
    wineOrder: number;
    isOwner: boolean;
    isPressEnabled: boolean;
    isStatusVisible: boolean;
    hasEventEnded: boolean;
    t: TTranslate;
}

const getWineSetStatus = (item: IWineSetItem): WineSetTastingStatus => {
    return item.tastingStatus || 'not_started';
};

const getStatusBadgeData = (
    status: WineSetTastingStatus,
    isStatusVisible: boolean,
    hasEventEnded: boolean,
    t: TTranslate,
): { label: string; type: WineSetStatusBadgeType } | null => {
    if (!isStatusVisible) {
        return null;
    }

    if (status === 'tasted') {
        return { label: t('wine.wineSetStatusTasted'), type: 'tasted' };
    }

    if (hasEventEnded) {
        return { label: t('wine.wineSetStatusMissed'), type: 'missed' };
    }

    if (status === 'in_progress') {
        return { label: t('wine.wineSetStatusInProgress'), type: 'inProgress' };
    }

    return { label: t('wine.wineSetStatusNotStarted'), type: 'notStarted' };
};

export const useWineSetItem = ({
    eventId,
    item,
    isBlindTasting,
    wineOrder,
    isOwner,
    isPressEnabled,
    isStatusVisible,
    hasEventEnded,
    t,
}: IUseWineSetItemProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const producerPrefix = item.wine.producer ? `${item.wine.producer}, ` : '';
    const vintageSuffix = item.wine.vintage ? ` ${item.wine.vintage}` : '';
    const defaultTitle = `${producerPrefix}${item.wine.name}${vintageSuffix}`;
    const defaultImageUrl = item.wine.image?.smallUrl || item.wine.image?.mediumUrl || item.wine.image?.originalUrl || '';
    const title = isBlindTasting ? `Wine ${wineOrder}` : defaultTitle;
    const imageUrl = isBlindTasting ? '' : defaultImageUrl;
    const isImageVisible = !isBlindTasting;
    const status = getWineSetStatus(item);
    const statusBadgeData = getStatusBadgeData(status, isStatusVisible, hasEventEnded, t);
    const wineId = item.wineId || item.wine.id;
    const isEventTastingStatus = status === 'not_started' || status === 'in_progress';
    const userRating = item.avgUserRating ?? null;
    const expertRating = item.avgExpertRating ?? null;
    const hasUserRating = userRating !== null;
    const hasExpertRating = expertRating !== null && expertRating >= 70;
    const ratingData = isOwner && (hasUserRating || hasExpertRating)
        ? {
            userRatingText: hasUserRating ? userRating.toFixed(1) : null,
            expertRating,
            expertRatingText: hasExpertRating ? expertRating.toFixed(1) : null,
            showUserRating: hasUserRating,
            showExpertRating: hasExpertRating,
        }
        : null;
    const isOwnerPressAvailable = isOwner && !!ratingData;
    const isParticipantPressAvailable = !isOwner && isPressEnabled && isEventTastingStatus;
    const isPressAvailable = isOwnerPressAvailable || isParticipantPressAvailable;

    const onPress = useCallback(() => {
        if (!isPressAvailable) {
            return;
        }

        if (isParticipantPressAvailable) {
            navigation.navigate('TastingWineLookView', {
                eventId,
                wineId,
                tastingStatus: status,
                isBlindTasting,
            });
            return;
        }

        navigation.navigate('TastingWineDetailsView', {
            eventId,
            wineId,
        });
    }, [eventId, isBlindTasting, isParticipantPressAvailable, isPressAvailable, navigation, status, wineId]);

    return {
        title,
        imageUrl,
        isImageVisible,
        statusBadgeData,
        ratingData,
        isPressAvailable,
        onPress,
    };
};
