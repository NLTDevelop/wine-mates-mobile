import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { IWinePurchasePartner } from '@/entities/wine/types/IWinePurchasePartner';
import { PartnerStatus } from '@/entities/wine/enums/PartnerStatus';
import { wineMarketplaceService } from '@/entities/wine/services/WineMarketplaceService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { IWinePurchaseCard } from '../types/IWinePurchaseCard';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWineMarketplaceSummary } from '@/entities/wine/types/IWineMarketplaceSummary';

const PRIVATE_OFFERS_CARD_ID = -1;

const getPartnersFromSummary = (summary: IWineMarketplaceSummary): IWinePurchasePartner[] => {
    const partners: IWinePurchasePartner[] = [];

    if (summary.winery) {
        partners.push({
            id: summary.winery.id,
            name: summary.winery.name,
            description: summary.winery.description || '',
            websiteUrl: summary.winery.websiteUrl,
            status: PartnerStatus.WINERY,
            logo: null,
            image: summary.winery.mainPhoto,
            minPrice: summary.winery.minPrice,
            currency: summary.winery.currency,
        });
    }

    summary.partners.forEach(partner => {
        partners.push({
            ...partner,
            description: '',
            status: PartnerStatus.STORE,
        });
    });

    if (summary.users?.minPrice !== null && summary.users?.minPrice !== undefined) {
        partners.push({
            id: PRIVATE_OFFERS_CARD_ID,
            name: localization.t('wineMarketplace.privateOffers'),
            description: '',
            websiteUrl: null,
            status: PartnerStatus.BUSINESS_PARTNERS,
            logo: null,
            image: null,
            minPrice: summary.users.minPrice,
            maxPrice: summary.users.maxPrice ?? undefined,
            currency: summary.users.currency,
        });
    }

    return partners;
};

const getPriceText = (partner: IWinePurchasePartner) => {
    if (partner.minPrice === undefined) {
        return null;
    }

    const currency = partner.currency || '';
    if (partner.maxPrice !== undefined && partner.maxPrice !== partner.minPrice) {
        return (
            `${localization.t('wineMarketplace.from')} ${partner.minPrice} ` +
            `${localization.t('wineMarketplace.to')} ${partner.maxPrice} ${currency}`.trim()
        );
    }

    return `${localization.t('wineMarketplace.from')} ${partner.minPrice} ${currency}`.trim();
};

const getCardTitle = (partner: IWinePurchasePartner) => {
    if (partner.status === PartnerStatus.WINERY) {
        return {
            titlePrefix: localization.t('wineMarketplace.wineryOfferTitlePrefix'),
            titleHighlight: partner.name,
        };
    }

    if (partner.status === PartnerStatus.STORE) {
        return {
            titlePrefix: localization.t('wineMarketplace.storeOfferTitlePrefix'),
            titleHighlight: partner.name,
        };
    }

    return {
        titlePrefix: localization.t('wineMarketplace.userOffersTitlePrefix'),
        titleHighlight: localization.t('wineMarketplace.userOffersTitleHighlight'),
    };
};

export const useWineMarketplace = (
    wineId: number,
    wineDetails: IWineDetails,
    isAllVintagesSelected: boolean,
    isActive: boolean,
) => {
    const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
    const [partners, setPartners] = useState<IWinePurchasePartner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const marketplaceWineIdRef = useRef(wineId);
    const latestRequestIdRef = useRef(0);
    const activeRequestRef = useRef<{ id: number; key: string } | null>(null);
    const loadedRequestKeyRef = useRef<string | null>(null);

    const getPartners = useCallback(async (showLoader = true, force = false) => {
        if (!isActive) {
            latestRequestIdRef.current += 1;
            activeRequestRef.current = null;
            return;
        }

        const marketplaceWineId = marketplaceWineIdRef.current;
        const requestKey = `${marketplaceWineId}`;
        if (activeRequestRef.current?.key === requestKey) {
            return;
        }

        if (!force && loadedRequestKeyRef.current === requestKey) {
            setIsLoading(false);
            return;
        }

        const requestId = latestRequestIdRef.current + 1;
        latestRequestIdRef.current = requestId;
        activeRequestRef.current = { id: requestId, key: requestKey };

        if (showLoader) {
            setIsLoading(true);
        }

        try {
            const response = await wineMarketplaceService.getPurchasePartners({
                wineId: marketplaceWineId,
            });

            if (response.isError || !response.data) {
                if (requestId !== latestRequestIdRef.current) {
                    return;
                }

                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            if (requestId !== latestRequestIdRef.current) {
                return;
            }

            setPartners(getPartnersFromSummary(response.data));
            loadedRequestKeyRef.current = requestKey;
        } finally {
            if (activeRequestRef.current?.id === requestId) {
                activeRequestRef.current = null;
            }

            if (requestId === latestRequestIdRef.current) {
                setIsLoading(false);
            }
        }
    }, [isActive]);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            getPartners();
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [getPartners]);

    const onRefresh = useCallback(async () => {
        await getPartners(false, true);
    }, [getPartners]);

    const onRetry = useCallback(async () => {
        await getPartners(true, true);
    }, [getPartners]);

    const onPartnerPress = useCallback(
        async (partner: IWinePurchasePartner) => {
            if (partner.status === PartnerStatus.BUSINESS_PARTNERS) {
                navigation.navigate('PrivateWineOffersView', {
                    wineId,
                    wineDetails,
                    vintages: isAllVintagesSelected ? 'All' : undefined,
                });
                return;
            }

            if (!partner.websiteUrl) {
                return;
            }

            try {
                await Linking.openURL(partner.websiteUrl);
            } catch {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            }
        },
        [isAllVintagesSelected, navigation, wineDetails, wineId],
    );

    const cards = useMemo<IWinePurchaseCard[]>(() => {
        return partners.map(partner => ({
            id: partner.id,
            name: partner.name,
            ...getCardTitle(partner),
            imageUrl: partner.image?.mediumUrl || partner.image?.originalUrl || partner.image?.smallUrl || null,
            logoUrl: partner.logo?.mediumUrl || partner.logo?.originalUrl || null,
            priceText: getPriceText(partner),
            hasPriceRange:
                partner.minPrice !== undefined &&
                partner.maxPrice !== undefined &&
                partner.maxPrice !== partner.minPrice,
            status: partner.status,
            onPress: () => onPartnerPress(partner),
        }));
    }, [onPartnerPress, partners]);

    return {
        cards,
        isLoading: isActive && partners.length === 0 && isLoading,
        onRefresh,
        onRetry,
    };
};
