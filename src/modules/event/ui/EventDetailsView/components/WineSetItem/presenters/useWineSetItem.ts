import { useCallback } from 'react';
import { IWineSetItem, WineSetTastingStatus } from '@/entities/events/types/IWineSetItem';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUiContext } from '@/UIProvider';

type WineSetStatusBadgeType = 'notStarted' | 'inProgress' | 'tasted' | 'missed';
type TTranslate = (key: string, options?: Record<string, unknown>) => string;

interface IUseWineSetItemProps {
    item: IWineSetItem;
    isBlindTasting: boolean;
    wineOrder: number;
    isPressEnabled: boolean;
    isStatusVisible: boolean;
    hasEventEnded: boolean;
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
    item,
    isBlindTasting,
    wineOrder,
    isPressEnabled,
    isStatusVisible,
    hasEventEnded,
}: IUseWineSetItemProps) => {
    const { t } = useUiContext();
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

    const onPress = useCallback(() => {
        if (!isPressEnabled) {
            return;
        }

        navigation.navigate('WineDetailsView', { wineId: item.wineId || item.wine.id });
    }, [isPressEnabled, item.wine.id, item.wineId, navigation]);

    return {
        title,
        imageUrl,
        isImageVisible,
        statusBadgeData,
        onPress,
    };
};
