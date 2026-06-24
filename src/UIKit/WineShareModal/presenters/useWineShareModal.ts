import { useCallback, useMemo, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { useUiContext } from '@/UIProvider';
import { createWineDeepLink } from '@/navigation/rootNavigator/linking';
import { prepareWineShareMessage } from '@/modules/wine/utils/prepareWineShareMessage';
import { shareWine } from '@/modules/wine/utils/shareWine';
import { toastService } from '@/libs/toast/toastService';

type WineShareItem = IWineListItem | IWineDetails;

const getWineTitle = (item: WineShareItem) => {
    const parts = [item.producer, item.name, item.vintage ? `${item.vintage}` : null].filter(Boolean);

    if (parts.length) {
        return parts.join(' ');
    }

    return `Wine #${item.id}`;
};

export const useWineShareModal = () => {
    const { t } = useUiContext();
    const [selectedWine, setSelectedWine] = useState<WineShareItem | null>(null);

    const isShareModalVisible = !!selectedWine;
    const wineDeepLink = useMemo(() => {
        if (!selectedWine) {
            return '';
        }

        return createWineDeepLink(selectedWine.id);
    }, [selectedWine]);

    const shareMessage = useMemo(() => {
        if (!selectedWine) {
            return '';
        }

        return prepareWineShareMessage({
            intro: t('wine.shareWineIntro'),
            labels: {
                title: t('wine.shareWineName'),
                producer: t('wine.shareWineProducer'),
                grapeVariety: t('wine.shareWineGrapeVariety'),
                country: t('wine.country'),
                region: t('wine.region'),
                type: t('wine.typeOfWine'),
            },
            title: getWineTitle(selectedWine),
            producer: selectedWine.producer,
            grapeVariety: selectedWine.grapeVariety,
            country: selectedWine.country?.name,
            region: selectedWine.region?.name,
            type: selectedWine.type?.name,
            link: wineDeepLink,
        });
    }, [selectedWine, t, wineDeepLink]);

    const onOpenShareModal = useCallback((item: WineShareItem) => {
        setSelectedWine(item);
    }, []);

    const onCloseShareModal = useCallback(() => {
        setSelectedWine(null);
    }, []);

    const onShareMessengerPress = useCallback(async () => {
        if (!selectedWine) {
            return;
        }

        const wineImageUrl = selectedWine.image?.originalUrl || selectedWine.defaultImage?.originalUrl || null;
        setSelectedWine(null);

        try {
            await shareWine({
                filename: `wine-${selectedWine.id}`,
                imageUrl: wineImageUrl,
                message: shareMessage,
                title: t('wine.shareWineTitle'),
            });
        } catch (error) {
            console.warn('useWineShareModal -> onShareMessengerPress: ', error);
            toastService.showError(t('common.errorHappened'), t('common.somethingWentWrong'));
        }
    }, [selectedWine, shareMessage, t]);

    const onCopyWineLinkPress = useCallback(() => {
        if (!wineDeepLink) {
            return;
        }

        Clipboard.setString(wineDeepLink);
        setSelectedWine(null);
        toastService.showSuccess(t('wine.shareWineLinkCopied'));
    }, [t, wineDeepLink]);

    return {
        isShareModalVisible,
        onOpenShareModal,
        onCloseShareModal,
        onShareMessengerPress,
        onCopyWineLinkPress,
    };
};
