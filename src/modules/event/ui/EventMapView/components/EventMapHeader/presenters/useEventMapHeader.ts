import { useCallback } from 'react';
import { useUiContext } from '@/UIProvider';

interface IUseEventMapHeaderProps {
    selectedTab: 'all' | 'tastings' | 'parties';
    onTabChange: (tab: 'all' | 'tastings' | 'parties') => void;
}

interface ITabItem {
    value: 'all' | 'tastings' | 'parties';
    label: string;
    isActive: boolean;
    onPress: () => void;
}

export const useEventMapHeader = ({ selectedTab, onTabChange }: IUseEventMapHeaderProps) => {
    const { t } = useUiContext();

    const onPressAllTab = useCallback(() => {
        onTabChange('all');
    }, [onTabChange]);

    const onPressTastingsTab = useCallback(() => {
        onTabChange('tastings');
    }, [onTabChange]);

    const onPressPartiesTab = useCallback(() => {
        onTabChange('parties');
    }, [onTabChange]);

    const tabs: ITabItem[] = [
        {
            value: 'all',
            label: t('eventMap.all'),
            isActive: selectedTab === 'all',
            onPress: onPressAllTab,
        },
        {
            value: 'tastings',
            label: t('event.tastings'),
            isActive: selectedTab === 'tastings',
            onPress: onPressTastingsTab,
        },
        {
            value: 'parties',
            label: t('event.parties'),
            isActive: selectedTab === 'parties',
            onPress: onPressPartiesTab,
        },
    ];

    return {
        tabs,
    };
};
