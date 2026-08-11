import { useCallback, useState } from 'react';
import { WineDetailsTab } from '../enums/WineDetailsTab';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

export const useWineDetailsTabs = () => {
    const [activeTab, setActiveTab] = useState(WineDetailsTab.PROFILE);
    const [shouldRenderEvolution, setShouldRenderEvolution] = useState(false);

    const onProfilePress = useCallback(() => {
        setActiveTab(WineDetailsTab.PROFILE);
    }, []);

    const onEvolutionPress = useCallback(() => {
        setShouldRenderEvolution(true);
        setActiveTab(WineDetailsTab.EVOLUTION);
    }, []);

    const onPurchasePress = useCallback(() => {
        setActiveTab(WineDetailsTab.PURCHASE);
    }, []);

    const onGetPremiumPress = useCallback(() => {
        toastService.showInfo(localization.t('wineMarketplace.getPremiumUnavailable'));
    }, []);

    return {
        isProfileActive: activeTab === WineDetailsTab.PROFILE,
        isEvolutionActive: activeTab === WineDetailsTab.EVOLUTION,
        isPurchaseActive: activeTab === WineDetailsTab.PURCHASE,
        shouldRenderEvolution,
        onProfilePress,
        onEvolutionPress,
        onPurchasePress,
        onGetPremiumPress,
    };
};
