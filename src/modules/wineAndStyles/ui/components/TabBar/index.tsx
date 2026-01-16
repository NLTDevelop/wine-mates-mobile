import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CrownIcon } from '@assets/icons/CrownIcon';

interface IProps {
    tabBarProps: any;
    handleIndexChange: (index: number) => void;
}

export const TabBar = ({ tabBarProps, handleIndexChange }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { navigationState } = tabBarProps;

    return (
        <View style={styles.tabBarContainer}>
            {navigationState.routes.map((route: any, index: number) => {
                const isFocused = navigationState.index === index;
                const isTasteProfileTab = route.key === 'muTasteProfile';
                return (
                    <TouchableOpacity
                        key={route.key}
                        style={[styles.tabItem, isFocused && styles.activeTabItem]}
                        onPress={() => handleIndexChange(index)}
                    >
                        {isTasteProfileTab ? (
                            <View style={styles.tabLabelRow}>
                                <View style={styles.crownIcon}>
                                    <CrownIcon width={16} height={16} />
                                </View>
                                <Typography variant={'body_500'} text={route.title} style={styles.tabLabel} />
                            </View>
                        ) : (
                            <Typography variant={'body_500'} text={route.title} style={styles.tabLabel} />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
