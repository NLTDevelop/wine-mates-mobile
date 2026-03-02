import { useMemo } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CrownIcon } from '@assets/icons/CrownIcon';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import { useTabBar } from './useTabBar';
import { isIOS } from '@/utils';

interface IProps {
    tabBarProps: any;
    handleIndexChange: (index: number) => void;
    hasPremium: boolean;
}

export const TabBar = ({ tabBarProps, handleIndexChange, hasPremium }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { navigationState } = tabBarProps;
    const { showBlur } = useTabBar();


    return (
        <View style={styles.tabBarContainer}>
            {navigationState.routes.map((route: any, index: number) => {
                const isFocused = navigationState.index === index;
                const isTasteProfileTab = route.key === 'muTasteProfile';
                const isDisabled = isTasteProfileTab && !hasPremium;
                return (
                    <TouchableOpacity
                        key={route.key}
                        style={[styles.tabItem, isFocused && styles.activeTabItem, isDisabled && Platform.OS !== 'ios' && styles.disabledTabItem]}
                        onPress={() => !isDisabled && handleIndexChange(index)}
                        disabled={isDisabled}
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
                        {isDisabled && isIOS && showBlur && (
                            <BlurView
                                style={styles.blurOverlay}
                                blurType={'light'}
                                blurAmount={5}
                                reducedTransparencyFallbackColor={'transparent'}
                            />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
