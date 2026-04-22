import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { FilterIcon } from '@assets/icons/FilterIcon';
import { useEventMapHeader } from './presenters/useEventMapHeader';
import { getStyles } from './styles';

interface IProps {
    selectedTab: 'all' | 'tastings' | 'parties';
    onTabChange: (tab: 'all' | 'tastings' | 'parties') => void;
    onFilterPress: () => void;
    onAddEventPress: () => void;
    isUpdateEventDisabled: boolean;
    filterCount: number;
}

export const EventMapHeader = ({
    selectedTab,
    onTabChange,
    onFilterPress,
    onAddEventPress,
    isUpdateEventDisabled,
    filterCount,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { tabs } = useEventMapHeader({ selectedTab, onTabChange });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography text={t('eventMap.wineEvents')} variant="h3" />
                <TouchableOpacity
                    onPress={onAddEventPress}
                    disabled={isUpdateEventDisabled}
                    style={isUpdateEventDisabled ? styles.updateButtonDisabled : undefined}
                >
                    <Typography
                        text={t('event.updateEvent')}
                        variant="h6"
                        style={styles.updateButton}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.tabRow}>
                <View style={styles.tabsContainer}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.value}
                            onPress={tab.onPress}
                            style={styles.tab}
                        >
                            <Typography
                                text={tab.label}
                                variant="h6"
                                style={tab.isActive ? styles.activeTabText : styles.inactiveTabText}
                            />
                            {tab.isActive && <View style={styles.activeTabIndicator} />}
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
                    <FilterIcon />
                    {filterCount > 0 && (
                        <View style={styles.badge}>
                            <Typography
                                text={filterCount.toString()}
                                variant="subtitle_12_400"
                                style={styles.badgeText}
                            />
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};
