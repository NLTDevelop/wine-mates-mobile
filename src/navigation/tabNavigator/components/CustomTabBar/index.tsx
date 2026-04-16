import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationState, PartialState } from '@react-navigation/native';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

type TabRoute = BottomTabBarProps['state']['routes'][number];

const getFocusedRouteName = (route: TabRoute): string => {
    const nestedState = route.state as (PartialState<NavigationState> | NavigationState | undefined);

    if (!nestedState) {
        return route.name;
    }

    const nestedRoute = nestedState.routes[nestedState.index ?? 0] as TabRoute | undefined;

    if (!nestedRoute) {
        return route.name;
    }

    return getFocusedRouteName(nestedRoute);
};

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const { colors } = useUiContext();
    const { bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);

    const activeRoute = state.routes[state.index];
    const focusedRouteName = getFocusedRouteName(activeRoute);
    const normalizedRouteName =
        activeRoute.name === 'ScannerStack' && focusedRouteName === 'ScannerStack'
            ? 'ScannerView'
            : focusedRouteName;
    const shouldHideTabBar =
        (activeRoute.name === 'ScannerStack' && normalizedRouteName === 'ScannerView') ||
        (activeRoute.name === 'EventStack' && normalizedRouteName === 'LocationPickerView');

    if (shouldHideTabBar) {
        return null;
    }

    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const activeColor = options.tabBarActiveTintColor ?? colors.primary;
                const inactiveColor = options.tabBarInactiveTintColor ?? colors.text_light;
                const color = isFocused ? activeColor : inactiveColor;

                const isDisabled = options.tabBarAccessibilityLabel === 'disabled';

                const onPress = () => {
                    if (isDisabled) return;

                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const icon = options.tabBarIcon ? options.tabBarIcon({ focused: isFocused, color, size: 24 }) : null;

                const label = typeof options.tabBarLabel === 'string' ? options.tabBarLabel : route.name;

                return (
                    <TouchableOpacity 
                        key={route.key} 
                        style={[styles.tabItem, isDisabled && { opacity: 0.4 }]} 
                        onPress={onPress}
                        disabled={isDisabled}
                    >
                        {icon}
                        <Typography variant="subtitle_12_400" text={String(label)} style={[styles.text, { color }]} />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
