import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { WineDetailsTab } from '../enums/WineDetailsTab';

export const useWineDetailsTabs = () => {
    const navigation = useNavigation();
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
        navigation.navigate('PaymentsView' as never);
    }, [navigation]);

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
