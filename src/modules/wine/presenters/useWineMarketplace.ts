import { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { IWinePurchasePartner } from '@/entities/wine/types/IWinePurchasePartner';
import { PartnerStatus } from '@/entities/wine/enums/PartnerStatus';
import { wineMarketplaceService } from '@/entities/wine/services/WineMarketplaceService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { IWinePurchaseCard } from '../types/IWinePurchaseCard';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';

const getPriceText = (partner: IWinePurchasePartner) => {
    if (partner.minPrice === undefined) {
        return null;
    }

    const currency = partner.currency || '';
    if (partner.maxPrice !== undefined) {
        return `${localization.t('wineMarketplace.from')} ${partner.minPrice} `
            + `${localization.t('wineMarketplace.to')} ${partner.maxPrice} ${currency}`.trim();
    }

    return `${localization.t('wineMarketplace.from')} ${partner.minPrice} ${currency}`.trim();
};

export const useWineMarketplace = (wineId: number, wineDetails: IWineDetails) => {
    const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
    const [partners, setPartners] = useState<IWinePurchasePartner[]>([]);
    const [selectedPartner, setSelectedPartner] = useState<IWinePurchasePartner | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const getPartners = useCallback(async () => {
        setIsLoading(true);
        const response = await wineMarketplaceService.getPurchasePartners(wineId);

        if (response.isError || !response.data) {
            toastService.showError(
                localization.t('common.errorHappened'),
                response.message || localization.t('common.somethingWentWrong'),
            );
        } else {
            setPartners(response.data);
        }
        setIsLoading(false);
    }, [wineId]);

    useEffect(() => {
        wineMarketplaceService.getPurchasePartners(wineId).then(response => {
            if (!response.isError && response.data) {
                setPartners(response.data);
            }
            setIsLoading(false);
        });
    }, [wineId]);

    const onPartnerPress = useCallback((partner: IWinePurchasePartner) => {
        if (partner.status === PartnerStatus.BUSINESS_PARTNERS) {
            navigation.navigate('PrivateWineOffersView', { wineId, wineDetails });
            return;
        }

        if (partner.website) {
            setSelectedPartner(partner);
        }
    }, [navigation, wineDetails, wineId]);

    const cards = useMemo<IWinePurchaseCard[]>(() => {
        return partners.map(partner => ({
            id: partner.id,
            name: partner.name,
            description: partner.description,
            imageUrl: partner.image.mediumUrl || partner.image.originalUrl,
            logoUrl: partner.logo?.mediumUrl || partner.logo?.originalUrl || null,
            priceText: getPriceText(partner),
            hasPriceRange: partner.minPrice !== undefined && partner.maxPrice !== undefined,
            status: partner.status,
            onPress: () => onPartnerPress(partner),
        }));
    }, [onPartnerPress, partners]);

    const onClosePartnerModal = useCallback(() => {
        setSelectedPartner(null);
    }, []);

    const onOpenPartnerWebsite = useCallback(async () => {
        const website = selectedPartner?.website;
        if (!website) {
            return;
        }

        setSelectedPartner(null);
        try {
            await Linking.openURL(website);
        } catch {
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        }
    }, [selectedPartner]);

    return {
        cards,
        isLoading,
        selectedPartner,
        isPartnerModalVisible: Boolean(selectedPartner),
        onClosePartnerModal,
        onOpenPartnerWebsite,
        onRetry: getPartners,
    };
};
