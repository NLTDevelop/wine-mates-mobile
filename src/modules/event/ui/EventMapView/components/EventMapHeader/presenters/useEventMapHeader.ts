import { useCallback } from 'react';
import { useUiContext } from '@/UIProvider';

interface IUseEventMapHeaderProps {
    selectedTab: 'all' | 'tastings' | 'parties';
    onTabChange: (tab: 'all' | 'tastings' | 'parties') => void;
}

export const useEventMapHeader = ({ selectedTab, onTabChange }: IUseEventMapHeaderProps) => {
    const { t } = useUiContext();

    const tabs = [
        {
            value: 'all' as const,
            label: t('eventMap.all'),
            isActive: selectedTab === 'all',
        },
        {
            value: 'tastings' as const,
            label: t('event.tastings'),
            isActive: selectedTab === 'tastings',
        },
        {
            value: 'parties' as const,
            label: t('event.parties'),
            isActive: selectedTab === 'parties',
        },
    ];

    const onTabPress = useCallback((tab: 'all' | 'tastings' | 'parties') => {
        onTabChange(tab);
    }, [onTabChange]);

    return {
        tabs,
        onTabPress,
    };
};
