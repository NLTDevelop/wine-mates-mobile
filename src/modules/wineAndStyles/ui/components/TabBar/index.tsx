import { useMemo } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CrownIcon } from '@assets/icons/CrownIcon';
import { toastService } from '@/libs/toast/toastService';

interface IProps {
    tabBarProps: any;
    onIndexChange: (index: number) => void;
    hasPremium: boolean;
}

export const TabBar = ({ tabBarProps, onIndexChange, hasPremium }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { navigationState } = tabBarProps;

    return (
        <View style={styles.tabBarContainer}>
            {navigationState.routes.map((route: any, index: number) => {
                const isFocused = navigationState.index === index;
                const isTasteProfileTab = route.key === 'muTasteProfile';
                const isLocked = isTasteProfileTab && !hasPremium;
                const onPress = () => {
                    if (isLocked) {
                        //TODO After premium functionality will be ready
                        toastService.showInfo('Will be soon');
                    } else {
                        onIndexChange(index)
                    }
                }
                return (
                    <TouchableOpacity
                        key={route.key}
                        style={[styles.tabItem, isFocused && styles.activeTabItem, isLocked && Platform.OS !== 'ios' && styles.disabledTabItem]}
                        onPress={onPress}
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
